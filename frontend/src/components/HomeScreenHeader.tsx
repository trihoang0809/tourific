import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { UserProps } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { fetchInitialNotificationCount, storeNotificationCount } from "@/utils/AsyncStorageUtils";
import { FriendRequest, Notification, TripMembership } from "@/types";
const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;

export const HomeScreenHeader: React.FC<UserProps> = ({ user }) => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [invitations, setInvitations] = useState<TripMembership[]>([]);

  useEffect(() => {
    getFriendRequests();
    getTripInvitations();
  }, []);

  useEffect(() => {
    const totalNotifications = requests.length + invitations.length;
    console.log("totalnoti: ", totalNotifications)
    storeNotificationCount(totalNotifications)
    setNotificationCount(totalNotifications)
  }, [requests, invitations]);

  const getFriendRequests = async () => {
    try {
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/user/friend/pending-requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        console.error("Failed to fetch friend requests");
      }
      const data = await response.json();
      setRequests(data);
      console.log("Friend requests fetch:", data);
    } catch (error: any) {
      console.error(
        "Error fetching pending friend requests:",
        error.toString(),
      );
    }
  };

  const getTripInvitations = async () => {
    try {
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/invite/all-received`,
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
      <View>
        <Text style={styles.appName}>tourific</Text>
      </View>
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
        <Image style={styles.avatar} source={{ uri: user.avatar.url }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    backgroundColor: "white",
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
    width: 30,
    height: 30,
    borderRadius: 20,
    marginLeft: 20,
  },
});
