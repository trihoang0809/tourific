import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useGlobalSearchParams, Stack, router, Link } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Dimensions, RefreshControl } from "react-native";
import { DateTime } from "luxon";
import { extractDateTime } from "@/utils";
import { any } from "zod";
import { Avatar } from "react-native-paper";
import SplashScreen from "@/components/Loading/SplashScreen";

const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;
const width = Dimensions.get("window").width; //full width
const height = Dimensions.get("window").height; //full height

const TripDetailsScreen = () => {
  const { id } = useGlobalSearchParams();
  const [trip, setTrip] = useState({
    name: "",
    location: { address: "", citystate: "", radius: 0 },
    startDate: new Date(),
    endDate: new Date(),
    startHour: 0,
    startMinute: 0,
    endHour: 0,
    endMinute: 0,
    participants: [],
    image: { url: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const defaultUri =
    "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTM3Mjd8MHwxfHNlYXJjaHw1fHxUcmF2ZWx8ZW58MHx8fHwxNzE2MTczNzc1fDA&ixlib=rb-4.0.3&q=80&w=400";
  // more setting icon
  const [schedule, setSchedule] = useState({ route: [any], cost: -1 });
  const getTrip = async ({
    id: text,
  }: {
    id: string | string[] | undefined;
  }) => {
    try {
      setIsLoading(true);
      console.log(EXPO_PUBLIC_HOST_URL);
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }
      // Optionally, you can handle the response here
      const data = await response.json();
      setTrip(data);
      setTrip((prev: any) => ({
        ...prev,
        name: data.name,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        startHour: extractDateTime(new Date(data.startDate).toISOString()).hour,
        startMinute: extractDateTime(new Date(data.startDate).toISOString())
          .minute,
        endHour: extractDateTime(new Date(data.endDate).toISOString()).hour,
        endMinute: extractDateTime(new Date(data.endDate).toISOString()).minute,
        location: data.location,
        image: data.image,
      }));
    } catch (error: any) {
      console.error("Error fetching trip:", error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  console.log("participants", trip.participants);
  // get participants
  const getParticipants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${id}/participants`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch participants");
      }
      const data = await response.json();
      if (trip.participants != data) {
        setTrip((prev) => ({ ...prev, participants: data }));
      }
    } catch (error: any) {
      console.error("Error fetching participants:", error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  console.log("participants", trip.participants);
  console.log("trips", trip);
  useEffect(() => {
    console.log("id", id);
    getTrip({ id });
  }, []);

  const onRefresh = useCallback(() => {
    getTrip({ id });
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getTrip({ id });
        await getParticipants();
      } catch (error) {
        console.error("Error in fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <View>
      {isLoading ? (
        <View style={{ backgroundColor: "white" }}>
          <SplashScreen width={width} height={height} />
        </View>
      ) : (
        <ScrollView style={{ width: width, height: height }}>
          <View>
            <Image
              style={styles.image}
              source={
                trip.image && trip.image.url
                  ? { uri: trip.image.url }
                  : {
                      uri: defaultUri,
                    }
              }
            />
          </View>
          <View
            style={{
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              flex: 1,
              marginTop: -50,
            }}
            className="bg-white h-full"
          >
            <View style={styles.view}>
              <View
                style={{
                  paddingHorizontal: 30,
                  paddingVertical: 19,
                  height: height,
                }}
              >
                <Text style={[styles.h1, { marginTop: 18 }]}>{trip.name}</Text>
                <View style={styles.row}>
                  <Ionicons name="location-outline" size={25} color="#006ee6" />
                  <View>
                    <Text style={[styles.h3, { marginLeft: 10 }]}>
                      {trip.location.address} {trip.location.citystate}
                    </Text>
                    <Text style={[styles.h4, { marginLeft: 10 }]}>
                      + {Number(trip.location.radius * 0.0006213712).toFixed(2)}{" "}
                      miles
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <Ionicons name="calendar-outline" size={25} color="#006ee6" />
                  <View style={styles.dateContainer}>
                    <Text style={[styles.h3, { marginHorizontal: 10 }]}>
                      {new Date(trip.startDate).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={[styles.h4, { marginLeft: 10 }]}>
                      {DateTime.fromISO(trip.startDate.toString())
                        .setZone("system")
                        .toLocaleString(DateTime.TIME_SIMPLE)}
                      {/* {trip.startDate.getHours() % 12 || 12}:{trip.startDate.getMinutes().toString().padStart(2, '0')} {trip.startDate.getHours() >= 12 ? 'PM' : 'AM'} */}
                    </Text>
                  </View>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={25}
                    color="#006ee6"
                  />
                  <View style={styles.dateContainer}>
                    <Text style={[styles.h3, { marginLeft: 10 }]}>
                      {new Date(trip.endDate).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={[styles.h4, { marginLeft: 10 }]}>
                      {DateTime.fromISO(trip.endDate.toString())
                        .setZone("system")
                        .toLocaleString(DateTime.TIME_SIMPLE)}
                      {/* {trip.endDate.getHours() % 12 || 12}:{trip.endDate.getMinutes().toString().padStart(2, '0')} {trip.endDate.getHours() >= 12 ? 'PM' : 'AM'} */}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.h4, { marginLeft: 35 }]}>
                  {DateTime.local().zoneName}
                </Text>
                <Text style={styles.h2}>Participants</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 30,
                    flexWrap: "wrap",
                    marginTop: 10,
                  }}
                >
                  {trip.participants &&
                    trip.participants.length > 0 &&
                    trip.participants.map((user, index) => (
                      <View key={user?.invitee?.id} style={{}}>
                        <Avatar.Image
                          size={50}
                          source={{ uri: user?.invitee?.avatar?.url }}
                        />
                        <Text>
                          {`${user?.invitee?.firstName} ${user?.invitee?.lastName}`}
                        </Text>
                      </View>
                    ))}
                  <TouchableOpacity
                    style={[
                      styles.additionalAvatar,
                      {
                        width: 50,
                        height: 50,
                        borderRadius: 9999,
                      },
                    ]}
                    onPress={() => router.navigate(`/trips/${id}/participants`)}
                  >
                    <Text style={styles.additionalText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontWeight: "600",
    fontSize: 26,
  },
  h2: {
    fontWeight: "400",
    fontSize: 24,
    marginTop: 20,
  },
  h3: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 22,
  },
  h4: {
    color: "#676765",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  dateContainer: {
    marginLeft: 2,
    marginRight: 2,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 150,
  },
  view: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    backgroundColor: "white",
    marginTop: -12,
    paddingTop: 6,
  },
  row: {
    flexDirection: "row",
    marginTop: 18,
  },
  additionalAvatar: {
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  additionalText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default TripDetailsScreen;
