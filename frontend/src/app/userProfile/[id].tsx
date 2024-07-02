import { View } from "react-native";
import UserProfileView from "@/screens/UserProfile/UserProfileView";
import { useLocalSearchParams } from "expo-router";
const userProfileUI = () => {
  const { id } = useLocalSearchParams();
  return <UserProfileView userID={id}></UserProfileView>;
};

export default userProfileUI;
