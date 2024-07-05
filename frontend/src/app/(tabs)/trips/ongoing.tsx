import React from "react";
import { View } from "react-native";
import { ListFilteredCards } from "@/screens/UpcomingList";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { userId } = useLocalSearchParams();
  return (
    <View>
      <SafeAreaView>
        <ListFilteredCards isUpcoming={false} userId={userId} />
      </SafeAreaView>
    </View>
  );
}
