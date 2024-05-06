import React from 'react';
import { Dimensions, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from '@/mock-data/user';

export default function App() {

  return (
    <View className="flex-1 bg-white">
      <HomeScreen user={sampleUser} />
    </View>
  );
}
