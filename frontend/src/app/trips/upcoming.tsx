import React from 'react';
import { View, Text } from 'react-native';
import { ListFilteredCards } from '@/screens/UpcomingList';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <View>
      <SafeAreaView>
        <ListFilteredCards isUpcoming={true} />
      </SafeAreaView>
    </View>
  );
}
