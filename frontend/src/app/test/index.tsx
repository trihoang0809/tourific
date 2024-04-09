import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text>inside test/index.tsx</Text>
      <StatusBar style="auto" />
    </View>
  );
}
