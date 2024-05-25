import { View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, router, useGlobalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import ActivityThumbnail from "@/components/ActivityThumbnail";
import { mockData } from "../../../../mock-data/activities";
import { ActivityProps } from "@/types";
import Style from "Style";

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
      <Stack.Screen
        options={{
          title: 'Activities',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTransparent: false,
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
        style={Style.addIcon}
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
