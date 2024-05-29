import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import ActivityThumbnail from "@/components/ActivityThumbnail";
import { mockData } from "../../../../mock-data/activities";
import { ActivityProps } from "@/types";
import { serverURL } from "@/utils";

const ActivitiesScreen = () => {
  const { id } = useGlobalSearchParams();
  const serverUrl = serverURL();
  const [activityData, setActivityData] = useState(mockData);
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
  useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await fetch(
          serverUrl + `trips/${id}` + "/activities",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify(req),
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trip");
        }
        // Optionally, you can handle the response here
        const data = await response.json();
        setActivityData(data);
        console.log("Trip fetch:", data);
      } catch (error: any) {
        console.error("Error fetching trip:", error.toString());
      }
    };
    getActivities();
  }, []);
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
        {activityData.map((activity) => (
          <TouchableOpacity
            style={{ width: "100%", padding: 15 }}
            onPress={() => {
              router.push({
                pathname: "../activity/view",
                params: { actId: activity.id, tripId: id },
              });
            }}
          >
            <ActivityThumbnail key={activity.id} {...activity} />
          </TouchableOpacity>
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
          router.push("../activity/create");
        }}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ActivitiesScreen;
