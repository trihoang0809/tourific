import React from 'react';
import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from '@/mock-data/user';
// import { ProposedActivities } from '@/screens/ProposedActivities';

export default function App() {
  return (
    <View className="flex-1 bg-white">
      <HomeScreen user={sampleUser} />
      <Link href='/trips/6629e6fb53739625b7cadf7b'>Go to trip at the beach</Link>
      <Link href='/trips/create'>Go to trip create</Link>
    </View>
  );
}
