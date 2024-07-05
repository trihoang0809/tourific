import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import NotificationTab from "@/components/NotificationTab";
import { EXPO_PUBLIC_HOST_URL, getUserIdFromToken } from "@/utils";

const search = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      setUserId(userId);
    };
    fetchUserId();
  }, []);
  return (
    <View>
      <NotificationTab userId={userId} />
    </View>
  );
};

export default search;
