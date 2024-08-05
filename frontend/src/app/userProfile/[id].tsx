import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import UserProfileView from "@/screens/UserProfile/UserProfileView";

const UserDetail = () => {
  const { firebaseUserId, isUser } = useLocalSearchParams();
  console.log("id: ", firebaseUserId);
  return (
    <UserProfileView
      userId={firebaseUserId as string}
      isUser={isUser as string}
    ></UserProfileView>
  );
};

export default UserDetail;
