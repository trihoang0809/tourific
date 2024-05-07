import { View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import ActivityThumbnail from "@/components/ActivityThumbnail";
import { mockData } from "../../../../mock-data/activities";
import { ActivityProps } from "@/types";

const ActivitiesScreen = () => {
  const { id } = useGlobalSearchParams();

  // const getActivities = async ({ id: text }: { id: string; }) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/trips/${id}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // body: JSON.stringify(req),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch trip");
  //     }
  //     // Optionally, you can handle the response here
  //     const data = await response.json();
  //     setTrip(data);
  //     console.log("Trip fetch:", data);
  //   } catch (error: any) {
  //     console.error("Error fetching trip:", error.toString());
  //   }
  // };

  return (
    <View style={{ flex: 1, height: Dimensions.get("window").height }}>
      {/* <Stack.Screen
        options={{
          title: '',
          headerShown: true,
          headerBackTitle: 'Back',
          headerBackTitleStyle: { fontSize: 10 },
          
        }}
      /> */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 5,
        }}
      >
        {/* <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center', width: '50%',height: 250, padding: 10}} 
          onPress={() => { }}>
          <Text>Add</Text>
        </TouchableOpacity> */}
        {mockData.map((activity: ActivityProps, index: number) => (
          <View style={{ width: "100%", padding: 15 }}>
            <ActivityThumbnail key={index} {...activity} />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
          position: "absolute",
          bottom: 10,
          right: 10,
          borderRadius: 35,
          backgroundColor: "#006ee6",
          shadowOffset: { width: 1, height: 1 },
          shadowColor: "#333",
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
        onPress={() => {
          /* Handle the button press */
        }}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ActivitiesScreen;
