import React from 'react';
import { SplashScreen, Stack } from 'expo-router';

const RootNavigation = () => {
  return (
    <Stack>
      <Stack.Screen 
        name='trips' 
        options={{ title: 'Trip', headerShown: true }}
      />
    </Stack>
  );
};

export default RootNavigation;
