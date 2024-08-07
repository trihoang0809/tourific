import React from "react";
import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{ title: "Trip", headerShown: false }}
      />
      <Stack.Screen
        name="upcoming"
        options={{
          title: "Upcoming trips",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#fff", // Customize the background color
          },
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ongoing"
        options={{
          title: "Ongoing trips",
          headerShown: true,
          headerTitleAlign: "center",
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          ),
        }}
      />
      {/* <Stack.Screen
        name="create"
        options={{
          title: "Create trip",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#red", // Customize the background color
          },
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          ),
        }}
      /> */}
    </Stack>
  );
};

export default Layout;
