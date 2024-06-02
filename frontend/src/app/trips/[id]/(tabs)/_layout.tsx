import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function TabLayout() {
  const { id } = useLocalSearchParams();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#006ee6",
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 12,
        },
        tabBarItemStyle: {
          height: 50,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,

          headerTitle: '',
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Suggestions",
          tabBarIcon: ({ color }) => (
            <AntDesign name="find" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{
          title: "Itinerary",
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}