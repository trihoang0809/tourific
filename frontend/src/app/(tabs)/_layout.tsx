import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import { Tabs } from "expo-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const RootNavigation = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs>
        <Tabs.Screen
          name="home/index"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="trips"
          options={{
            title: "",
            headerShown: false,
            href: "trips/create",
            tabBarIcon: ({ focused }: { focused: boolean; }) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: focused ? "#673ab7" : "#222",
                    width: Platform.OS === "ios" ? 50 : 60,
                    height: Platform.OS === "ios" ? 50 : 60,
                    top: -10,
                    borderRadius: 9999,
                  }}
                >
                  <Ionicons name="add" size={40} color="white" />
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name="globalItinerary/index"
          options={{ headerShown: true }}
        />
        <Tabs.Screen
          name="friends"
          options={{ href: null, headerShown: false }}
        />
        <Tabs.Screen
          name="userProfile/profile"
          options={{ href: null, headerShown: false }}
        />
        <Tabs.Screen
          name="userProfile/[id]"
          options={{ href: null, headerShown: false }}
        />
        <Tabs.Screen
          name="userProfile/update"
          options={{ href: null, headerShown: false }}
        />
      </Tabs>
    </QueryClientProvider>
  );
};

export default RootNavigation;
