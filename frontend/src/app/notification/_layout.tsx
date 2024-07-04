import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Notifications", headerShown: true, headerTitle: "Notifications" }}
      />
    </Stack>
  );
};

export default Layout;