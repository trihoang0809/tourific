import React from "react";
import { Stack } from "expo-router";
import { HomeScreenHeader } from "@/components/HomeScreenHeader";
import { sampleUser } from "@/mock-data/user";

const RootNavigation = () => {
  return (
    <Stack>
      <Stack.Screen
        name='trips'
        options={{
          title: 'Trip',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="friends"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default RootNavigation;
