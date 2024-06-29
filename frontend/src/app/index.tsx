import React from 'react';
import { SafeAreaView } from 'react-native';
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from "@/mock-data/user";
import Style from 'Style';

export default function App() {
  return (
    <SafeAreaView style={Style.AndroidSafeArea}>
      <HomeScreen user={sampleUser} />
    </SafeAreaView>
  );
}
