import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { ListFilteredCards } from '@/screens/UpcomingList';
import { Stack } from 'expo-router';

export default function App() {
  return (
    <View>
      {/* <StatusBar backgroundColor="black"/> */}
      <ListFilteredCards />
    </View>
  );
}
