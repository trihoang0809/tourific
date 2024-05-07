import React from 'react';
import { View, Text } from 'react-native';
import { ListFilteredCards } from '@/screens/UpcomingList';
import { Stack } from 'expo-router';

export default function App() {
  return (
    <View>
      <ListFilteredCards />
    </View>
  );
}
