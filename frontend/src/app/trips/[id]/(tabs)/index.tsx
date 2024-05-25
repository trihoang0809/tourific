import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import favicon from "@/assets/favicon.png";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { DateTime } from 'luxon';
import { SafeAreaView } from "react-native-safe-area-context";

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

  // more setting icon
  const [modalEditVisible, setModalEditVisible] = useState(false);


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

  // showing more setting options
  const showMoreSetting = () => {
    setModalEditVisible(true);
  };

  const notShowMoreSetting = () => {
    setModalEditVisible(false);
  };

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
            <Link href={`/trips/create?id=${id}`}>
              <Feather
                onPressIn={showMoreSetting}
                onPressOut={notShowMoreSetting}
                name="edit-2"
                size={20}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Link>
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
        <View
          style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, flex: 1, marginTop: -50 }}
          className="bg-white h-full"
        >
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 19,
              height: height,
            }}
          >
            <Text className="font-bold text-3xl mb-5">{trip.name}</Text>
            <View className="mb-3" style={{ flexDirection: "row", alignItems: "start" }}>
              <Ionicons name="location" size={25} color="navy" />
              <View>
                <Text className="ml-2 text-lg font-semibold">
                  {trip.location.address} {trip.location.citystate}
                </Text>
                <Text className='ml-2 text-gray-500 text-lg'>
                  + {(Number(trip.location.radius * 0.0006213712).toFixed(2))} miles
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "start" }}>
              <Ionicons name="calendar" size={25} color="navy" />
              <View className="ml-2 mr-2" style={{ justifyContent: "center" }}>
                <Text className="text-lg font-semibold">
                  {new Date(trip.startDate).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text className="text-gray-500 text-lg">
                  {DateTime.fromISO(trip.startDate.toString()).setZone("system").toLocaleString(DateTime.TIME_SIMPLE)}
                  {/* {trip.startDate.getHours() % 12 || 12}:{trip.startDate.getMinutes().toString().padStart(2, '0')} {trip.startDate.getHours() >= 12 ? 'PM' : 'AM'} */}
                </Text>
              </View>
              <Ionicons name="arrow-forward-outline" size={25} color="navy" />
              <View className="ml-2" style={{ justifyContent: "center" }}>
                <Text className="text-lg font-semibold">
                  {new Date(trip.endDate).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text className="text-gray-500 text-lg">
                  {DateTime.fromISO(trip.endDate.toString()).setZone("system").toLocaleString(DateTime.TIME_SIMPLE)}
                  {/* {trip.endDate.getHours() % 12 || 12}:{trip.endDate.getMinutes().toString().padStart(2, '0')} {trip.endDate.getHours() >= 12 ? 'PM' : 'AM'} */}
                </Text>
              </View>

            </View>
            <Text className="text-gray-800 text-base ml-8">{DateTime.local().zoneName}</Text>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderColor: "navy",
                marginVertical: 20,
              }}
            ></View>
            <Text className="font-bold text-2xl mb-3">Participants</Text>
          </View>
        </View>
      </ScrollView>
      {/* <TouchableOpacity
        onPress={() => <Link href={`/trips/${id}/edit`} />}
        className="absolute p-2 rounded-full inset-x-8 radius-20"
        style={{
          bottom: 100,
          backgroundColor: "navy",
        }}
      >
        <Text className="text-white text-base text-center">Edit</Text>
      </TouchableOpacity> */}
    </View >
  );
};

export default TripDetailsScreen;