import React from 'react';
import { SplashScreen, Stack } from 'expo-router';

const RootNavigation = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Trips', headerShown: true }}/>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="upcoming" options={{headerShown: true}}/>
    </Stack>
  );
};

export default RootNavigation;