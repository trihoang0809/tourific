import React from 'react';
import { View } from 'react-native';
import { ListFilteredCards } from '@/screens/UpcomingList';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <View>
      <SafeAreaView>
        <ListFilteredCards isUpcoming={false} />
      </SafeAreaView>
    </View>
  );
}
