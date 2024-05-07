import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
// import PopupMenu from '@/components/PopupMenu/PopupMenu';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Link href="/trips/661f78b88c72a65f2f6e49d4">
        Go to trip at the beach
      </Link>
      <Link href="/trips/create">Go to trip create</Link>
      <StatusBar style="auto" />
    </View>
  );
}
