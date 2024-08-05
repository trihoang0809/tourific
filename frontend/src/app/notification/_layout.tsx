import React from "react";
import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Notifications",
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
    </Stack>
  );
};

export default Layout;
