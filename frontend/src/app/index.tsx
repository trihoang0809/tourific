import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text>Open up app/index.tsx to start working on your app!</Text>
      <Link href='/trips/6629e6fb53739625b7cadf7b'>Go to trip at the beach</Link>
      <Link href='/trips/create'>Go to trip create</Link>
      <StatusBar style="auto" />
    </View>
  );
}
