import { View, Text } from 'react-native';
import React from 'react';
import InvitePage from '@/components/Invitation/InvitePage';
import { Stack } from 'expo-router';

const index = () => {
  return (
    <View>
      <InvitePage />
    </View>
  );
};

export default index;
