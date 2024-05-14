import React from "react";
import { Stack } from "expo-router";

const RootNavigation = () => {
  return (
    <Stack>
      <Stack.Screen
        name='trips'
        options={{ title: 'Trip', headerShown: false }}
      />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootNavigation;