import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import favicon from "@/assets/favicon.png";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { trips } from "@/mock-data/trips";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { DateTime } from 'luxon';


const TripDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  // const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

  // const trip = trips.find(trip => trip.id === id);
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


  const getTrip = async ({ id: text }: { id: string }) => {
    try {
      const response = await fetch(`http://localhost:3000/trips/${id}`, {
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
    <View style={{ height: Dimensions.get("window").height }}>
      <Stack.Screen
        options={{
          title: '',
          headerShown: true,
          headerRight: () => (
            <Link href={`/trip/create?id=${id}`}>
              <Feather
                onPressIn={showMoreSetting}
                onPressOut={notShowMoreSetting}
                name="edit-2"
                size={24}
                color="black" />
            </Link>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Image className="w-full h-52" source={favicon} />
        </View>
        <View
          style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, flex: 1 }}
          className="bg-white -mt-12 pt-6"
        >
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 5,
              height: "auto",
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
                { DateTime.fromISO(trip.startDate.toString()).setZone("system").toLocaleString(DateTime.TIME_SIMPLE)}
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
                { DateTime.fromISO(trip.endDate.toString()).setZone("system").toLocaleString(DateTime.TIME_SIMPLE)}
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
      <TouchableOpacity
        onPress={() => <Link href={`/trips/${id}/edit`} />}
        className="absolute p-2 rounded-full inset-x-8 radius-20"
        style={{
          bottom: 100,
          backgroundColor: "navy",
        }}
      >
        <Text className="text-white text-base text-center">Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TripDetailsScreen;
