import React from 'react';
import { View } from 'react-native';
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from "@/mock-data/user";
import { Link } from 'expo-router';

export default function App() {

  return (
    <View className="flex-1 bg-white">
      <HomeScreen user={sampleUser} />
      {/* <Link href="/trips/6647d51b93fc814d91bbaf9e">go to trip</Link> */}
      <Link href="/trips/6647d51b93fc814d91bbaf9e/invite">Invite page</Link>
    </View>
  );
}
