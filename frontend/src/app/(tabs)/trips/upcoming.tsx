import React from "react";
import { View } from "react-native";
import { ListFilteredCards } from "@/screens/UpcomingList";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { userId } = useLocalSearchParams();
  return (
    <View style={{ backgroundColor: "white" }}>
      <ListFilteredCards isUpcoming={true} userId={userId} />
    </View>
  );
}
