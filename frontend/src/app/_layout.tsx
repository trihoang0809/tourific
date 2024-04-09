import React from 'react'
import { SplashScreen, Stack } from 'expo-router'

const RootNavigation = () => {
  return (
    <Stack>
      <Stack.Screen name='test' options={{ title: 'Testing', headerShown: false }}
      />
    </Stack>
  )
}

export default RootNavigation