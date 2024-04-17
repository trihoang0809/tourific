import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import favicon from "@/assets/favicon.png";
import { Link, useLocalSearchParams } from "expo-router";
import { trips } from "@/mock-data/trips";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const TripDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  // const trip = trips.find(trip => trip.id === id);
  const [trip, setTrip] = useState({
    name: "",
    location: { address: "", citystate: "", radius: 0 },
    startDate: new Date(),
    endDate: new Date(),
    startHour: 0,
    startMinute: 0,
  });

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
    getTrip({ id });
  }, []);

  return (
    <View style={{ height: Dimensions.get("window").height }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Image className="w-full h-52" source={favicon} />
          <TouchableOpacity
            onPress={() => <Link href="/trips" />}
            className="absolute top-8 left-4 bg-gray-50 p-1 rounded-full boxshadow"
          >
            <Ionicons name="chevron-back-circle" size={40} color="navy" />
          </TouchableOpacity>
        </View>
        <View
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1 }}
          className="bg-white -mt-12 pt-6"
        >
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 20,
              height: "auto",
            }}
          >
            <Text className="font-bold text-3xl mb-3">{trip.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location" size={20} color="navy" />
              <Text className="ml-3 text-gray-800 text-xl font-semibold">
                {trip.location.address} {trip.location.citystate}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="locate" size={20} color="navy" />
              <Text className='ml-3 text-gray-500 text-lg font-semibold'>{(Number(trip.location.radius * 0.0006213712).toFixed(2))} miles</Text>
            </View>
            {/* <View style={{ borderBottomWidth: 0.5, borderColor: 'navy', marginVertical: 20 }}></View> */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="calendar" size={20} color="navy" />
              <View className="ml-3 mr-3" style={{ justifyContent: "center" }}>
                <Text className="text-lg font-semibold">
                  {new Date(trip.startDate).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text className="text-gray-500 text-lg">
                {/* {trip.startDate.getHours() % 12 || 12}:{trip.startDate.getMinutes().toString().padStart(2, '0')} {trip.startDate.getHours() >= 12 ? 'PM' : 'AM'} */}
                </Text>
              </View>
              <Ionicons name="arrow-forward-outline" size={20} color="navy" />
              <View className="ml-3" style={{ justifyContent: "center" }}>
                <Text className="text-lg font-semibold">
                  {new Date(trip.endDate).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text className="text-gray-500 text-lg">
                {/* {trip.endDate.getHours() % 12 || 12}:{trip.endDate.getMinutes().toString().padStart(2, '0')} {trip.endDate.getHours() >= 12 ? 'PM' : 'AM'} */}
                </Text>
              </View>
            </View>
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
