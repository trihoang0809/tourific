import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
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
import { sampleUser } from "@/mock-data/user";

const screenw = Dimensions.get("window").width;
const titleWidth = screenw - screenw * 0.96;
export const HomeScreen: React.FC<UserProps> = ({ user }) => {
  const [ongoingTrips, setOngoingTrips] = useState<Trip[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const ongoing = await fetch(
          `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?ongoing=true`,
        );
        const upcoming = await fetch(
          `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?upcoming=true`,
        );
        const ongoingData = await ongoing.json();
        const upcomingData = await upcoming.json();

        setOngoingTrips(ongoingData);
        setUpcomingTrips(getRecentTrips(upcomingData));
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HomeScreenHeader user={sampleUser} />
      <ScrollView style={styles.container}>
        <View style={{ height: 180 }}>
          <Image
            source={{
              uri: randomizeCover(headerImage),
            }}
            style={{ height: 100, position: "absolute", width: "100%", top: 0 }}
            resizeMode="cover"
          />
        </View>
        <View style={{ marginTop: -80 }}>
          <View style={styles.inline}>
            <Text style={styles.title}>Ongoing Trips</Text>
            <Text
              onPress={() => {
                router.navigate("/trips/ongoing");
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
                <TripCard key={trip.id} trip={trip} height={250} width={300} />
              ))
            ) : (
              <Text style={styles.noTrip}>No ongoing trips</Text>
            )}
          </ScrollView>
        </View>
        <View style={{ marginTop: -5 }}>
          <View style={styles.inline}>
            <Text style={styles.title}>Upcoming Trips</Text>
            <Text
              onPress={() => {
                router.navigate("/trips/upcoming");
              }}
            >
              See all
            </Text>
          </View>
          <ScrollView style={{ paddingHorizontal: 10 }}>
            {upcomingTrips.slice(0, 3).map((trip) => (
              <View style={{ padding: 5, alignItems: "center" }}>
                <TripCardRect key={trip.id} trip={trip} height={100} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <TouchableOpacity style={Style.addIcon}>
        <Link href="/trips/create">
          <Ionicons name="add" size={40} color="white" />
        </Link>
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
  noTrip: {
    fontSize: 16,
    color: "red",
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
