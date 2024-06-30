import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ListFilteredCards } from "@/screens/UpcomingList";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserIdFromToken } from "@/utils";

export default function App() {
  const { userId } = useLocalSearchParams();
  return (
    <View>
      <SafeAreaView>
        <ListFilteredCards isUpcoming={true} userId={userId} />
      </SafeAreaView>
    </View>
  );
}
