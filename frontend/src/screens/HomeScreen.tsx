import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  Button,
} from "react-native";
import { TripCard } from "../components/TripCard/TripCard";
import { HomeScreenHeader } from "../components/HomeScreenHeader";
import { useState, useEffect } from "react";
import { UserProps, Trip } from "../types";
import { Link, router } from "expo-router";
import { EXPO_PUBLIC_HOST_URL, getRecentTrips, randomizeCover } from "@/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import TripCardRect from "@/components/TripCard/TripCardRect";
import { headerImage } from "@/utils/constants";
import Style from "Style";
import { getUserIdFromToken, getToken } from "@/utils";

const screenw = Dimensions.get("window").width;
const titleWidth = screenw - screenw * 0.96;
export const HomeScreen: React.FC<UserProps> = ({ user }) => {
  const [ongoingTrips, setOngoingTrips] = useState<Trip[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromToken();
      console.log("user Id logged in: ", id);
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const fetchTrips = async () => {
    console.log(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips?ongoing=true`);
    if (!userId) {
      console.error("User ID is null");
      return;
    }
    try {
      // const headers = {
      //   "Content-Type": "application/json",
      //   Authorization: `Bearer ${await getToken()}`,
      // };
      // console.log("Headers:  ", headers);

      const ongoing = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?ongoing=true&firebaseUserId=${userId}`,
        // { headers },
      );

      const upcoming = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?upcoming=true&firebaseUserId=${userId}`,
        // { headers },
      );

      const ongoingData = await ongoing.json();
      const upcomingData = await upcoming.json();

      setOngoingTrips(ongoingData);
      setUpcomingTrips(getRecentTrips(upcomingData));
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log("got user id: ", userId);
      fetchTrips();
    }
  }, [userId]);

  const onRefresh = useCallback(() => {
    fetchTrips();
  }, [userId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreenHeader user={user} />
      <View style={{ height: 1.5, backgroundColor: "#D3D3D3" }} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <View style={{ height: 180 }}>
          <Image
            source={{
              uri: randomizeCover(headerImage),
            }}
            style={{
              height: 180,
              position: "absolute",
              width: "100%",
              top: 0,
            }}
            resizeMode="cover"
          />
        </View>
        <View style={{ marginTop: -5 }}>
          <View style={styles.inline}>
            <Text style={styles.title}>Ongoing trips</Text>
            <Text
              onPress={() => {
                router.navigate({
                  pathname: "/trips/ongoing",
                  params: { userId: userId },
                });
              }}
            >
              See all
            </Text>
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.tripScroll}
          >
            {ongoingTrips.length > 0 ? (
              ongoingTrips.map((trip) => (
                <View key={trip.id}>
                  <TripCard trip={trip} height={230} width={300} />
                </View>
              ))
            ) : (
              <View style={styles.noTripContainer}>
                <Text style={styles.noTrip}>No trips yet!</Text>
              </View>
            )}
          </ScrollView>
        </View>
        <View style={{ marginTop: -5 }}>
          <View style={styles.inline}>
            <Text style={styles.title}>Upcoming trips</Text>
            <Text
              onPress={() => {
                router.navigate({
                  pathname: "/trips/upcoming",
                  params: { userId: userId },
                });
              }}
            >
              See all
            </Text>
          </View>
          <ScrollView style={{ paddingHorizontal: 10 }}>
            {upcomingTrips.slice(0, 3).map((trip) => (
              <View key={trip.id} style={{ padding: 5, alignItems: "center" }}>
                <TripCardRect trip={trip} height={100} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={Style.addIcon}
        onPress={() => router.navigate("/trips/create")}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tripScroll: {
    marginVertical: 4,
  },
  noTripContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 5,
    width: "100%",
    alignContent: "center",
    // height: "100%",
  },
  noTrip: {
    fontSize: 16,
    color: "#808080",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginTop: 10,
    width: 200,
    alignItems: "center",
    textAlign: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  inline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: titleWidth,
  },
});
