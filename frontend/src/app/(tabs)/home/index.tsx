import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, Tabs, useRouter } from "expo-router";
import { HomeScreen } from "@/screens/HomeScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "@/types";
import { getToken, decodeToken } from "@/utils";
import { Text, View, Button, Platform, StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const fetchUserInfo = async (userId: string): Promise<User> => {
  // Replace with your actual backend API call
  const response = await fetch(
    `http://${process.env.EXPO_PUBLIC_HOST_URL}:3000/user/${userId}`,
  );
  const data = await response.json();
  return data;
};

const index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const initializeUser = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const decodedToken = decodeToken(token);
      const userId = decodedToken.user_id || decodedToken.sub;

      if (!userId) {
        router.replace("/login");
        return;
      }

      try {
        const userInfo = await fetchUserInfo(userId);
        console.log("got the user right here: ", userInfo);
        setUser(userInfo);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        router.replace("/login");
      }
    };

    initializeUser();
  }, [router]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token),
    );
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <Tabs.Screen
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <HomeScreen user={user} />
      <StatusBar style="auto" />
      {/* <View
        style={{
          flex: 0.2,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text>Your expo push token: {expoPushToken}</Text>
      </View> */}
    </>
  );
};

export default index;

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
