import React from 'react';
import { View } from 'react-native';
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from "@/mock-data/user";

export default function App() {

  return (
    <View className="flex-1 bg-white">
      <HomeScreen user={sampleUser} />
    </View>
  );
}