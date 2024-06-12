import React from 'react';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TripLayout({ }) {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerBackTitle: '',
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={30}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => router.navigate('/')}
            />
          ),
        }}
      />
      {/* <Stack.Screen
        name="invite"
        options={{
          headerShown: true,
          headerBackTitle: 'Back to trip',
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={30}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => router.navigate('/')}
            />
          ),
        }}
      /> */}
    </Stack>
  );
}
