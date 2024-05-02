import React from 'react';
import { SplashScreen, Stack } from 'expo-router';

const RootNavigation = () => {
  return (
    <Stack>
      {/* <Stack.Screen name="trips" options={{ title: 'Testing', headerShown: false }}/> */}
      <Stack.Screen name="activity/create" options={{ title: 'Testing', headerShown: false }}/>
      <Stack.Screen name="trips/index" options={{ title: 'Testing', headerShown: true }}/>
      <Stack.Screen name="trips/[id]" />
      <Stack.Screen name="trips/upcoming" options={{headerShown: true}}/>
    </Stack>
  );
};

export default RootNavigation;