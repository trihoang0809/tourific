import { View, Text, ScrollView, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import favicon from "@/assets/favicon.png";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { DateTime } from "luxon";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { Rating } from "react-native-ratings";
const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;

const ViewActivity = () => {
  const { id } = useGlobalSearchParams();
  console.log("id (view activity):", id);
  const { itineraryid } = useGlobalSearchParams();
  console.log("itinerary-id (view activity):", itineraryid);
  const [isOnCalendar, setIsOnCalendar] = useState(false);
  const [liked, setLiked] = React.useState(false);
  const toggleLike = () => {
    setLiked(!liked);
  };
  const [activity, setActivity] = useState({
    name: "",
    description: "",
    location: { address: "", citystate: "", radius: 0 },
    startTime: new Date(),
    endTime: new Date(),
    notes: "",
    netUpvotes: 0,
    isOnCalendar: false,
    image: {
      url: "",
    },
  });

  const getActivity = async ({
    id,
    itineraryid,
  }: {
    id: string;
    itineraryid: string;
  }) => {
    try {
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${id}/activities/${itineraryid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(req),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }
      // Optionally, you can handle the response here
      const data = await response.json();
      setActivity(data);
      console.log("Activity fetch:", data);
    } catch (error: any) {
      console.error("Error fetching activity:", error.toString());
    }
  };

  useEffect(() => {
    if (typeof id === "string" && typeof itineraryid === "string") {
      getActivity({ id, itineraryid });
    }
    setIsOnCalendar(activity.isOnCalendar);
  }, []);

  return (
    <View style={{ height: Dimensions.get("window").height, flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.imageContainer}>
        <Pressable
          style={{ zIndex: 1, margin: 10, position: "absolute" }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back-outline" size={35} color="transparent" />
        </Pressable>
          <Image
            style={styles.image}
            source={{
              uri: activity.image?.url
                ? activity.image?.url
                : "https://images.unsplash.com/photo-1600456899121-68eda5705257?q=80&w=2757&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
          />
          <View style={styles.likeContainer}>
            <Text style={styles.h4}>{activity.netUpvotes}</Text>
            <TouchableOpacity style={styles.heartIcon} onPress={toggleLike}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                color="red"
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.view}>
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 5,
              height: "auto",
            }}
          >
            <Text style={[styles.h1, { marginTop: 18 }]}>{activity.name}</Text>
            <View style={styles.row}>
              <Text style={[styles.h3, { marginRight: 5 }]}>3</Text>
              {/* <Ionicons name="star" size={24} color="#FFC501" /> */}
              <Rating
                type="star"
                ratingCount={5}
                imageSize={20}
                readonly
                startingValue={3}
              />
            </View>
            <View style={styles.row}>
              <Ionicons name="location" size={25} color="#006ee6" />
              <View>
                <Text style={[styles.h3, { marginLeft: 10 }]}>
                  {activity.location.address} {activity.location.citystate}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <Ionicons name="calendar" size={25} color="#006ee6" />
              <View style={styles.dateContainer}>
                <Text style={[styles.h3, { marginHorizontal: 10 }]}>
                  {new Date(activity.startTime).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text style={[styles.h4, { marginLeft: 10 }]}>
                  {DateTime.fromISO(activity.startTime.toString())
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
                  {new Date(activity.endTime).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text style={[styles.h4, { marginLeft: 10 }]}>
                  {DateTime.fromISO(activity.endTime.toString())
                    .setZone("system")
                    .toLocaleString(DateTime.TIME_SIMPLE)}
                  {/* {trip.endDate.getHours() % 12 || 12}:{trip.endDate.getMinutes().toString().padStart(2, '0')} {trip.endDate.getHours() >= 12 ? 'PM' : 'AM'} */}
                </Text>
              </View>
            </View>
            <Text style={[styles.h4, { marginLeft: 35 }]}>
              {DateTime.local().zoneName}
            </Text>

            {/* <TouchableOpacity
              onPress={() => setIsOnCalendar(!isOnCalendar)}
              style={{
                width: "100%",
                backgroundColor: isOnCalendar ? "#006ee6" : "#D3D3D3",
                padding: 10,
                alignItems: "center",
                borderRadius: 10,
                shadowOffset: { width: 1, height: 1 },
                shadowColor: "#333",
                shadowOpacity: 0.3,
                shadowRadius: 2,
                marginTop: 20,
              }}
            >
              {isOnCalendar ? (
                <Text style={{ color: "white" }}>Added to Calendar</Text>
              ) : (
                <Text style={{ color: "black", borderColor: "black" }}>
                  Add to Calendar
                </Text>
              )}
            </TouchableOpacity> */}
            {activity.description && (
              <View>
                <Text style={styles.h2}>Description</Text>
                <Text style={styles.h4}>{activity.description}</Text>
              </View>
            )}
            <View>
              <Text style={styles.h2}>Notes</Text>
              <TouchableOpacity style={{ paddingBottom: 20 }}>
                {activity.notes ? (
                  <Text style={styles.h4}>{activity.notes}</Text>
                ) : (
                  <Text style={styles.h4}>Add notes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // scrollContainer: {
  //   display: 'flex',
  //   flex-direction: 'column',
  // },
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  imageContainer: {
    position: "relative",
  },
  likeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 5,
    borderRadius: 5,
  },
  heartIcon: {
    marginLeft: 5,
  },
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
});

export default ViewActivity;
