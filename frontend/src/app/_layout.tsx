import React from 'react';
import { SplashScreen, Stack } from 'expo-router';

const RootNavigation = () => {
  return (
    <Stack>
      <Stack.Screen name="trips" options={{ title: 'Testing', headerShown: false }}/>
      <Stack.Screen name="activity/create" options={{ title: 'Testing', headerShown: true }}/>
      <Stack.Screen name="index" options={{title: 'Tourific'}}/>
    </Stack>
  );
};

export default RootNavigation;