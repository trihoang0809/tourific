const userID = "66860537f96086257c3f9792";

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FriendRequest, Notification, TripMembership } from "@/types";
import { getTimeDuration, createNotification } from "@/utils";
import { storeNotificationCount } from "@/utils/AsyncStorageUtils";

const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;

const NotificationTab = () => {
  const [activeTab, setActiveTab] = useState("friendRequests");
  // Fetch all pending friend requests
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [invitations, setInvitations] = useState<TripMembership[]>([]);
  const [friendNotification, setFriendNotification] = useState<Notification[]>(
    [],
  );
  const [tripNotifications, setTripNotifications] = useState<Notification[]>(
    [],
  );
  useEffect(() => {
    const totalNotifications = requests.length + invitations.length;
    console.log("totalnoti: ", totalNotifications)
    storeNotificationCount(totalNotifications)
  }, [requests, invitations]);

  useEffect(() => {
    getFriendRequests();
    getTripInvitations();
    getNotification();
  }, []);
  // Fetch all pending trip invitations

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

  const getNotification = async () => {
    try {
      // Fetch FRIEND_ACCEPT notifications
      const friendResponse = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/notification?type=FRIEND_ACCEPT`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!friendResponse.ok) {
        console.error("Failed to fetch friend-related notifications");
      }
      const friendData = await friendResponse.json();
      setFriendNotification(friendData);
      console.log("Friend-related notifications fetched:", friendData);

      // Fetch TRIP_ACCEPT notifications
      const tripResponse = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/notification?type=TRIP_ACCEPT`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!tripResponse.ok) {
        console.error("Failed to fetch trip-related notifications");
      }
      const tripData = await tripResponse.json();
      setTripNotifications(tripData);
      console.log("Trip-related notifications fetched:", tripData);
    } catch (error: any) {
      console.error("Error fetching notifications:", error.toString());
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

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "friendRequests" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("friendRequests")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "friendRequests" && styles.activeTabText,
            ]}
          >
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "tripInvitations" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("tripInvitations")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "tripInvitations" && styles.activeTabText,
            ]}
          >
            Trips
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === "friendRequests" && (
        <FriendRequests
          requests={requests}
          friendNotifications={friendNotification}
        />
      )}
      {activeTab === "tripInvitations" && (
        <TripInvitations
          invitations={invitations}
          tripNotifications={tripNotifications}
        />
      )}
    </View>
  );
};

export default NotificationTab;

const FriendRequests: React.FC<{
  requests: FriendRequest[];
  friendNotifications: Notification[];
}> = ({ requests, friendNotifications }) => {
  return (
    <View>
      {requests &&
        requests.map((request, index) => (
          <FriendRequestCard key={index} request={request} />
        ))}
      {friendNotifications &&
        friendNotifications.map((friendNotification, index) => (
          <FriendAcceptCard
            key={index}
            friendNotification={friendNotification}
          />
        ))}
    </View>
  );
};
const TripInvitations: React.FC<{
  invitations: TripMembership[];
  tripNotifications: Notification[];
}> = ({ invitations, tripNotifications }) => {
  return (
    <View>
      {invitations &&
        invitations.map((invitation, index) => (
          <TripInvitationCard key={index} invitation={invitation} />
        ))}
      {tripNotifications &&
        tripNotifications.map((tripNotification, index) => (
          <TripNewMemberCard key={index} tripNotification={tripNotification} />
        ))}
    </View>
  );
};

const FriendRequestCard: React.FC<{ request: FriendRequest }> = ({
  request,
}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const handleAccept = () => {
    updateFriendship("true", request.sender.id);
    createNotification(request.sender.id, userID, "FRIEND_ACCEPT");
    setIsAccepted(true);
  };
  const handleDelete = () => {
    updateFriendship("false", request.sender.id);
    setIsDeleted(true);
  };
  const updateFriendship = async (status: string, friendId: string) => {
    try {
      const req = {
        friendId: friendId,
      };
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/user/friend?accept=${status}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        },
      );
      if (!response.ok) {
        console.error("Failed to update friend status");
      }
      const data = await response.json();
      console.log("Friend status updated:", data);
    } catch (error: any) {
      console.error("Error updating friendship:", error.toString());
    }
  };

  return isDeleted ? null : (
    <View style={styles.notification}>
      <Image
        source={{ uri: request.sender.avatar.url }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.userName}>
          {request.sender.firstName} {request.sender.lastName}
        </Text>
        <>
          <Text style={{ marginBottom: 10 }}>wants to become your friend.</Text>
          <View style={styles.buttonContainer}>
            {isAccepted ? (
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Accepted</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAccept}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>Decline</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      </View>
    </View>
  );
};

const FriendAcceptCard: React.FC<{
  friendNotification: Notification;
}> = ({ friendNotification }) => {
  return (
    <View style={styles.notification}>
      <Image
        source={{ uri: friendNotification.sender.avatar.url }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.userName}>
          {friendNotification.sender.firstName}{" "}
          {friendNotification.sender.lastName}
        </Text>
        <>
          <Text style={{ marginBottom: 10 }}>has become your friend.</Text>
          <Text style={{ color: "gray" }}>
            {getTimeDuration(friendNotification.createdAt)}
          </Text>
        </>
      </View>
    </View>
  );
};

const TripInvitationCard: React.FC<{ invitation: TripMembership }> = ({
  invitation,
}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const handleAccept = () => {
    invitation.trip.participants &&
      invitation.trip.participants.map((participant) => {
        createNotification(participant.id, userID, "TRIP_ACCEPT");
      });
    updateTripMembership("ACCEPTED", invitation.id);
    setIsAccepted(true);
  };
  const handleDelete = () => {
    updateTripMembership("REJECTED", invitation.id);
    setIsDeleted(true);
  };

  const updateTripMembership = async (status: string, invitationId: string) => {
    try {
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/invite/${invitationId}?status=${status}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        console.error("Failed to update trip membership status");
      }
      const data = await response.json();
      console.log("Trip membership status updated:", data);
    } catch (error: any) {
      console.error("Error updating trip membership status:", error.toString());
    }
  };

  return isDeleted ? null : (
    <View style={styles.notification}>
      <Image source={{ uri: invitation.trip.image.url }} style={styles.trip} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.userName}>
          {invitation.trip.name}
        </Text>
        <>
          <Text numberOfLines={2} style={{ marginBottom: 10 }}>
            {invitation.inviter?.firstName} {invitation.inviter?.lastName}{" "}
            invited you to join this trip.
          </Text>
          <View style={styles.buttonContainer}>
            {isAccepted ? (
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Joined</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAccept}
                >
                  <Text style={styles.acceptButtonText}>Join</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>Decline</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      </View>
    </View>
  );
};

const TripNewMemberCard: React.FC<{ tripNotification: Notification }> = ({
  tripNotification,
}) => {
  return (
    <View style={styles.notification}>
      <Image
        source={{ uri: tripNotification.trip.image.url }}
        style={styles.trip}
      />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.userName}>
          {tripNotification.trip.name}
        </Text>
        <Text numberOfLines={2} style={{ marginBottom: 10 }}>
          {tripNotification.sender.firstName} {tripNotification.sender.lastName}{" "}
          has joined your trip.
        </Text>
        <Text style={{ color: "gray" }}>
          {getTimeDuration(tripNotification.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007bff",
  },
  tabText: {
    fontSize: 16,
    fontWeight: 600,
    color: "#000",
  },
  activeTabText: {
    color: "#007bff",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
    marginBottom: 15, // Add space between each card
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 50,
    marginRight: 15,
  },
  trip: {
    width: 75,
    height: 85,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#d3d3d3",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
