import React from "react";
import { Tabs } from "expo-router";
import { Image, Platform, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RootNavigation = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen
        name="trips"
        options={{
          title: "",
          headerShown: false,
          href: "trips/create",
          tabBarIcon: ({ focused }: { focused: boolean; }) => {
            return (
              <View style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#673ab7" : "#222",
                width: Platform.OS == "ios" ? 50 : 60,
                height: Platform.OS == "ios" ? 50 : 60,
                top: -10,
                borderRadius: 9999,
              }}>
                <Ionicons name="add" size={40} color="white" />
              </View>
            );
          },
        }} />
      <Tabs.Screen
        name="userProfile/userProfileUI"
        options={{
          headerShown: false
        }}
      />
    </Tabs>
  );
};

export default RootNavigation;
