import { View, Text } from 'react-native';
import React from 'react';
import { HomeScreen } from '../../screens/HomeScreen';
import { Link, Stack } from 'expo-router';
import { User } from '@/types';


// route is /trips
const TripHomePage = () => {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Hehe",
          headerShown: false,
        }}
      />
    </View>
  );
};

export default TripHomePage;