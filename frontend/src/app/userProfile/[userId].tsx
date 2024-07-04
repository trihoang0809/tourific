import React from "react";
import UserProfileView from "@/screens/UserProfile/UserProfileView";
import { useLocalSearchParams } from "expo-router";

const UserProfile = () => {
  const { userId } = useLocalSearchParams();
  console.log("User Profile: ");
  console.log(userId);
  return <UserProfileView userID={String(userId)} />;
};

export default UserProfile;
