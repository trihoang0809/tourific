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
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.navigate("/home")}
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
              onPress={() => router.navigate("/home")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.navigate("/home")}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
