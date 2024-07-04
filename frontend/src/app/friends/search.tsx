import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import SearchFriend from '@/components/AddFriend/SearchFriend';

const search = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SearchFriend />
    </View>

  );
};

export default search;
