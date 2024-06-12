import { View } from 'react-native';
import React from 'react';
import InvitePage from '@/components/Invitation/InvitePage';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';

const index = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <InvitePage />
    </View>
  );
};

export default index;
