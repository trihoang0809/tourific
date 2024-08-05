import UserProfileView from "@/screens/UserProfile/UserProfileView";
import { getUserIdFromToken } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
const userProfileUI = () => {
  const { firebaseUserId, isUser } = useLocalSearchParams();
  console.log("hello, user Id: ", firebaseUserId);
  return (
    <UserProfileView
      userID={firebaseUserId as string}
      isUser={isUser as string}
    ></UserProfileView>
  );
};

export default userProfileUI;
