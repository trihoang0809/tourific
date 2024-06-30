import React from "react";
import { Tabs } from "expo-router";
import { Image, Platform, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RootNavigation = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen
        name="create/index"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean; }) => {
            return (
              <View style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#673ab7" : "#222",
                width: Platform.OS == "ios" ? 50 : 60,
                height: Platform.OS == "ios" ? 50 : 60,
                top: Platform.OS == "ios" ? -10 : -20,
                borderRadius: 9999,
                paddingTop: 16,
              }}>
                {/* <Image
                  contentFit="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={{ uri: "https://static.vecteezy.com/system/resources/previews/000/436/361/original/vector-add-icon.jpg" }}
                /> */}
                <Ionicons name="add" size={40} color="white" />
              </View>
            );
          },
        }} />
      <Tabs.Screen name="userProfile" options={{ title: "User", headerShown: false }} />
    </Tabs>
  );
};

export default RootNavigation;
