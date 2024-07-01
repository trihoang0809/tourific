import { View, SafeAreaView } from 'react-native';
import React from 'react';
import SearchFriend from '@/components/AddFriend/SearchFriend';
import { Stack } from 'expo-router';

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
