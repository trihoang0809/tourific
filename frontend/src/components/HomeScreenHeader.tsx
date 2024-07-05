import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { UserProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  fetchInitialNotificationCount,
  storeNotificationCount,
} from "@/utils/AsyncStorageUtils";
import {
  FriendRequestForNotification,
  Notification,
  TripMembership,
} from "@/types";
import { EXPO_PUBLIC_HOST_URL, getUserIdFromToken } from "@/utils";

export const HomeScreenHeader: React.FC<UserProps> = ({ user }) => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [requests, setRequests] = useState<FriendRequestForNotification[]>([]);
  const [invitations, setInvitations] = useState<TripMembership[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken();
      setUserId(userId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    getFriendRequests();
    getTripInvitations();
  }, [userId]);

  // useEffect(() => {
  //   const totalNotifications = requests.length + invitations.length;
  //   console.log("totalnoti: ", totalNotifications);
  //   storeNotificationCount(totalNotifications);
  //   setNotificationCount(totalNotifications);
  // }, [requests, invitations]);

  const getFriendRequests = async () => {
    try {
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/user/friend/pending-requests?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        console.error("Failed to fetch friend requests from homescreen");
      }
      const data = await response.json();
      setRequests(data);
      console.log("Friend requests fetch from homescreen:", data);
    } catch (error: any) {
      console.error(
        "Error fetching pending friend requests from homescreen:",
        error.toString(),
      );
    }
  };

  const getTripInvitations = async () => {
    try {
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/invite/all-received?firebaseUserId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        console.error("Failed to fetch trip invitations");
      }
      const data = await response.json();
      setInvitations(data);
      console.log("Trip invitations fetch:", data);
    } catch (error: any) {
      console.error(
        "Error fetching pending trip invitations:",
        error.toString(),
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const count = await fetchInitialNotificationCount();
      setNotificationCount(count);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.content}>
      <Image
        style={styles.logo}
        source={require("@/assets/Tourific Logo.png")}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => {
            router.push("/notification");
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 99 ? "99+" : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/friends/search")}
          style={{ marginRight: 5 }}
        >
          <Ionicons name="person-add-outline" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("userProfile/profile")}>
          <Image
            style={styles.avatar}
            source={{
              uri: user.avatar?.url
                ? user.avatar.url
                : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 20,
  },
  notificationContainer: {
    marginRight: 20,
  },
  notificationIcon: {
    position: "absolute",
    right: 60,
    padding: 10,
  },
  logo: {
    width: 150,
    height: 30,
    padding: 0,
    marginBottom: 2,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginLeft: 15,
  },
});
