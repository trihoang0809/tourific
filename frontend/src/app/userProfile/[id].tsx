import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import UserProfileView from '@/screens/UserProfile/UserProfileView';

const UserDetail = () => {
  const { id }: any = useLocalSearchParams();
  console.log("id: ", id)
  return (
    <UserProfileView userID={id}></UserProfileView>
  );
};

export default UserDetail;
