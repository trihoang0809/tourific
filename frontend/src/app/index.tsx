import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, Stack } from "expo-router";
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from "@/mock-data/user";

export default function App() {

  return (
    <View className="flex-1 bg-white">
      <HomeScreen user={sampleUser} />
      <Link href="/trips/661f78b88c72a65f2f6e49d4">
        Go to trip at the beach
      </Link>
      <Link href="/trips/create">Go to trip create</Link>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}