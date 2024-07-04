// [x] fetch real friend requests
// [x] TODO: "Accepted" after we click the button
// [ ] actual accept/decline after clicking the button
// [ ] fetch "accepted notification" from database

// [ ] fetch trip invitation
// [ ] TODO: "Accepted" after we click the button
// [ ] fetch "accepted notification" from database

//  Friend requests fetch: [{"friendStatus": "PENDING", "id": "6686af15221f4ff006d27f1f", "receiverID": "66860537f96086257c3f9792",
// "sender": {"avatar": [Object], "dateOfBirth": "2021-01-29T00:00:00.000Z", "email": "duyduy@gmail.com", "firstName": "Duy Kha",
// "id": "66842fd7f7e0a898807a4167", "lastName": "Tran", "password": "$2b$10$Yz5MG2MnGFpM7GKnQClQE.6NjSEt9WimAN031fghkWsuzTqSNVhem", "userName": "Kha Tran"},
// "senderID": "66842fd7f7e0a898807a4167"},
// {"friendStatus": "PENDING", "id": "6686af01221f4ff006d27f1e", "receiverID": "66860537f96086257c3f9792", "sender": {"avatar": [Object], "dateOfBirth": "2004-09-08T00:00:00.000Z", "email": "leomessi@gmail.com", "firstName": "Leo", "id": "6684ef6ca3ea75b07fde4608", "lastName": "Messi", "password": "$2b$10$/HrO3fd1QDas3Q5NwA0JguoOYKilqFuUbwR8W4CdOkW/VUOGeSLVy", "userName": "messi"}, "senderID": "6684ef6ca3ea75b07fde4608"}, {"friendStatus": "PENDING", "id": "6686aeb7221f4ff006d27f1c", "receiverID": "66860537f96086257c3f9792", "sender": {"avatar": [Object], "dateOfBirth": "2017-02-01T00:00:00.000Z", "email": "thanhvan@gmail.com", "firstName": "thanh", "id": "66860537f96086257c3f9792", "lastName": "van", "password": "$2b$10$rGxARuJlGtvBmB4SMmL27OtMkF4QLNmZ.T/RPnUoS/bjNS660EhBm", "userName": "thanhvan123"}, "senderID": "66860537f96086257c3f9792"}]

import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  FlatList,
  Alert,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Style from "Style";
import { Feather } from "@expo/vector-icons";

const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;

const mockUser = {
  firstName: "Mỹ",
  lastName: "Anh",
  userName: "meomuop",
  avatar: {
    url: "https://images.unsplash.com/photo-1608292415726-265dc19ae70c?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
};
const mockTrip = {
  name: "Di Tham Ba Ngoai",
  location: {
    citystate: "San Francisco, CA",
  },
  startDate: "2024-07-23T23:04:59.000+00:00",
  endDate: "2024-08-08T10:03:00.000+00:00",
  image: {
    url: "https://images.unsplash.com/photo-1719858403457-c03d19d28e86?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
};

const NotificationTab = () => {
  const [activeTab, setActiveTab] = useState("friendRequests");
  // Fetch all pending friend requests
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getFriendRequests();
  }, []);
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
        throw new Error("Failed to fetch friend requests");
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
      {activeTab === "friendRequests" && <FriendRequests requests={requests} />}
      {activeTab === "tripInvitations" && <TripInvitations />}
    </View>
  );
};

export default NotificationTab;

const FriendRequests = ({ requests }) => {
  return (
    <View>
      {requests &&
        requests.map((request, index) => (
          <FriendRequestCard
            key={index}
            user={request.sender}
            // isPending={request.isPending}
          />
        ))}
    </View>
  );
};
const TripInvitations = () => (
  <View>
    <View style={styles.notification}>
      <Image source={{ uri: mockTrip.image.url }} style={styles.trip} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.userName}>
          {mockTrip.name}
        </Text>
        <Text numberOfLines={2} style={{ marginBottom: 10 }}>
          {mockUser.firstName} {mockUser.lastName} invited you to join this
          5-day trip with 2 others.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View style={styles.notification}>
      <Image source={{ uri: mockTrip.image.url }} style={styles.trip} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.userName}>
          {mockTrip.name}
        </Text>
        <Text numberOfLines={2} style={{ marginBottom: 10 }}>
          {mockUser.firstName} {mockUser.lastName} invited you to join this
          5-day trip with 2 others.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View style={styles.notification}>
      <Image source={{ uri: mockTrip.image.url }} style={styles.trip} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.userName}>
          {mockTrip.name}
        </Text>
        <Text numberOfLines={2} style={{ marginBottom: 10 }}>
          {mockUser.firstName} {mockUser.lastName} has just joined your trip.
        </Text>
      </View>
    </View>
    {/* Add more trip invitation cards here */}
  </View>
);
// TODO: ReceivedFriendAcceptCard
const FriendRequestCard = ({ user }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const handleAccept = () => {
    setIsAccepted(true);
    // TODO: update backend
  };
  const handleDelete = () => {
    setIsDeleted(true);
    // TODO: delete from backend
  };

  return isDeleted ? null : (
    <View style={styles.notification}>
      <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.userName}>
          {user.firstName} {user.lastName}
        </Text>
        {/* {isPending ? ( */}
        {/* // ) : (
      //   <>
      //     <Text style={{ marginBottom: 10 }}>has become your friend.</Text>
      //     <Text style={{ color: "gray" }}>3 hours ago</Text>
      //   </>
      // )} */}
        <>
          <Text style={{ marginBottom: 10 }}>wants to become your friend.</Text>
          <View style={styles.buttonContainer}>
            {isAccepted ? (
              <TouchableOpacity
                style={styles.deleteButton}
              >
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

const TripInvitationCard = ({ trip, user, isPending }) => (
  <View style={styles.notification}>
    <Image source={{ uri: trip.image.url }} style={styles.trip} />
    <View style={styles.textContainer}>
      <Text numberOfLines={1} style={styles.userName}>
        {trip.name}
      </Text>
      {isPending ? (
        <>
          <Text numberOfLines={2} style={{ marginBottom: 10 }}>
            {user.firstName} {user.lastName} invited you to join this 5-day trip
            with 2 others.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text numberOfLines={2} style={{ marginBottom: 10 }}>
          {user.firstName} {user.lastName} has just joined your trip.
        </Text>
      )}
    </View>
  </View>
);

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
    height: 100,
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
