import { SafeAreaView } from 'react-native';
import React from 'react';
import InvitePage from '@/components/Invitation/InvitePage';
import { Stack } from 'expo-router';

const index = () => {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
        }}
      />
      <InvitePage />
    </SafeAreaView>
  );
};

export default index;
