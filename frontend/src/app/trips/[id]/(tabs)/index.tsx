import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import favicon from "@/assets/favicon.png";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { DateTime } from 'luxon';
import BottomSlider from "@/components/BottomSheet/BottomSlider";
import {
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { TouchableOpacity } from "react-native";

const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const TripDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  const [trip, setTrip] = useState({
    name: "",
    location: { address: "", citystate: "", radius: 0 },
    startDate: new Date(),
    endDate: new Date(),
    startHour: 0,
    startMinute: 0,
  });

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getTrip = async ({ id: text }: { id: string; }) => {
    try {
      console.log(EXPO_PUBLIC_HOST_URL);
      const response = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }
      // Optionally, you can handle the response here
      const data = await response.json();
      setTrip(data);
      console.log("Trip fetch:", data);
    } catch (error: any) {
      console.error("Error fetching trip:", error.toString());
    }
  };

  useEffect(() => {
    console.log("id", id);
    getTrip({ id });
  }, []);

  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Home',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTransparent: false,
          headerRight: () => (
            // <Link href={`/trips/create?id=${id}`}>
            <>
              <TouchableOpacity onPress={handlePresentModalPress}>
                <Feather
                  name="edit-2"
                  size={20}
                  color="black"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>

            </>
            // </Link>
          ),
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => router.navigate('/')}
            />
          ),
        }}
      />
      <ScrollView style={{ width: width, height: height }}>
        <View>
          <Image
            style={{ width: width, height: 200 }}
            source={favicon} />
        </View>
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
            {/* <AvatarGroup /> */}
          </View>
        </View>
      </ScrollView>
      <View style={{ flex: 1, paddingTop: 200 }}>
        <BottomSlider
          ref={bottomSheetModalRef}
          handlePresentModalPress={handlePresentModalPress}
          handleSheetChanges={handleSheetChanges}
        />
      </View>
    </View >
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
});

export default TripDetailsScreen;
