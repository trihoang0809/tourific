import React from "react";
import { View } from "react-native";
import { ListFilteredCards } from "@/screens/UpcomingList";
import { useLocalSearchParams } from "expo-router";

export default function App() {
  const { userId } = useLocalSearchParams();
  return (
    <View style={{ backgroundColor: "white" }}>
      <View>
        <ListFilteredCards isUpcoming={false} userId={userId} />
      </View>
    </View>
  );
}
