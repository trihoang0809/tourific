import UserProfileView from "@/screens/UserProfile/UserProfileView";
import { getUserIdFromToken } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
const userProfileUI = () => {
  const { firebaseUserId } = useLocalSearchParams();
  return <UserProfileView userID={firebaseUserId as string}></UserProfileView>;
};

export default userProfileUI;
