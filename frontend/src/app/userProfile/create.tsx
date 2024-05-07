import React from "react";
import { View } from "react-native";
import { UserProfileCreate } from "@/screens/UserProfile/UserProfileCreate";
const CreatePage = () => {
  return (  
      <UserProfileCreate method="POST"/>
  );
}
 
export default CreatePage;