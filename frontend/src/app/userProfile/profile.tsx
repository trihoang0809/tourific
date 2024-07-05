import UserProfileView from "@/screens/UserProfile/UserProfileView";
import { getUserIdFromToken } from "@/utils";
import { useState, useEffect } from "react";
const userProfileUI = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      setUserId(userId);
    };
    fetchUserId();
  }, []);
  return <UserProfileView userID={userId}></UserProfileView>;
};

export default userProfileUI;
