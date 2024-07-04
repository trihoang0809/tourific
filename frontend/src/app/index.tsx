import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from "@/mock-data/user";
import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  Platform,
} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { sendPushNotification } from "@/utils";
import { user0, user2, user3, mockTrip } from "@/mock-data/forNotification";

// Use any userId here
const userId = "6683f5179867bc7464c5c7bd";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const updateNotificationTokenOnBackend = async (
    notificationToken: string,
  ) => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_HOST_URL}:3000/user/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notificationToken: notificationToken,
          }),
        },
      );
    } catch (error: any) {
      console.error("Error updating user's push token:", error.toString());
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      token && setExpoPushToken(token);
      updateNotificationTokenOnBackend(expoPushToken);
    });
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

  return (
    <View className="flex-1 bg-white">
      <HomeScreen user={sampleUser} />
      <View
        style={{
          flex: 0.5,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text>Your expo push token: {expoPushToken}</Text>
        <Button
          onPress={() =>
            sendPushNotification({
              to: user2.notificationToken,
              sound: "default",
              title: `${user0.firstName} wants to be your friend!`,
              body: `@${user0.userName} just sent you a friend request`,
            })
          }
          title={`Add friend with ${user2.firstName}`}
        />
        <Button
          onPress={() =>
            sendPushNotification({
              to: user3.notificationToken,
              sound: "default",
              title: `Ready to travel with ${user0.firstName}?`,
              body: `@${user0.userName} has accepted your friend request`,
            })
          }
          title={`Accept friend request of ${user3.firstName}`}
        />
        <Button
          onPress={() =>
            sendPushNotification({
              to: user2.notificationToken,
              sound: "default",
              title: `Go to ${mockTrip.location.citystate} with ${user0.firstName}!`,
              body: `@${user0.userName} has invited you to join the trip ${mockTrip.name}`,
            })
          }
          title={`Invite ${user2.firstName} to trip X`}
        />
        <Button
          onPress={() =>
            sendPushNotification({
              to: user3.notificationToken,
              sound: "default",
              title: `${user0.firstName} is excited about ${mockTrip.location.citystate} too!`,
              body: `@${user0.userName} has accepted your travel invitation`,
            })
          }
          title={`Accept trip invitation of ${user3.firstName}`}
        />
      </View>
    </View>
  );
}

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
