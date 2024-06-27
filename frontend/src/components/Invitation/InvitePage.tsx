import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import ContactCard from '../Avatar/ContactCard';
import { EXPO_PUBLIC_HOST_URL } from '@/utils';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FriendRequest, User } from '@/types';
import NoFriendDisplay from '../AddFriend/NoFriendDisplay';
import { SafeAreaView } from 'react-native';

const screenHeight = Dimensions.get("window").height;

const InvitePage = () => {
  const { id } = useLocalSearchParams();
  const userId = "6661308f193a6cd9e0ea4d36";
  const [searchTerm, setSearchTerm] = useState("");
  const [friendList, setFriendList] = useState<User[]>([]);
  const [friendsToInvite, setFriendsToInvite] = useState<FriendRequest[]>([]);
  const [invitations, setInvitations] = useState<string[]>([]);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    // Add functionality here if needed to filter friends based on search term
  };

  const getAllFriends = async () => {
    try {
      const usersToInvite = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/${userId}/friends`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!usersToInvite.ok) {
        throw new Error("Failed to fetch list of friends");
      }

      const result = await usersToInvite.json();
      console.log(result);
      setFriendList(result);
    } catch (error) {
      console.error("Failed to fetch trip participants", error);
    }
  };

  const getFriendsToInvite = async () => {
    try {
      console.log("tripid", id);
      const usersToInvite = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${id}/non-participants`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!usersToInvite.ok) {
        throw new Error("Failed to fetch trip participants");
      }

      const result = await usersToInvite.json();
      setFriendsToInvite(result);
    } catch (error) {
      console.error("Failed to fetch trip participants", error);
    }
  };

  console.log("invitations", invitations);
  console.log("friendsToInvite", friendsToInvite);
  useEffect(() => {
    getAllFriends();
    getFriendsToInvite();
  }, [id]);

  const isChecked = (userId: string) => {
    return invitations.includes(userId);
  };

  const setChecked = (isChecked: boolean, userId: string): void => {
    setInvitations((currentInvitations) => {
      if (isChecked) {
        return [...currentInvitations, userId];
      } else {
        return currentInvitations.filter(id => id !== userId);
      }
    });
  };

  const sendInvitations = async () => {
    try {
      const inviteeIds = invitations;
      console.log("inviteeIds", inviteeIds);
      const response = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips/invite/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteeIds }),
      });

      if (response.ok) {
        setFriendsToInvite(prev => prev.filter(user => !invitations.includes(user.nonParticipant.id)));
        alert('Invitations sent successfully!');
      } else {
        throw new Error("Failed to send invitations");
      }
    } catch (error) {
      console.error("Failed to send invitations", error);
    }
  };

  const handleSkip = () => {
    router.push(`/trips/${id}`);
  };

  console.log("friendsToInvite", friendsToInvite);

  return (
    <SafeAreaView
      style={{ height: screenHeight, flexDirection: 'column', backgroundColor: 'white' }}
    >
      {friendsToInvite?.length > 0 ?
        <>
          <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
            Invite friends to the trip
          </Text>
          <Text style={{ fontSize: 15, color: 'gray', textAlign: 'left', marginHorizontal: 20, marginTop: 10 }}>
            Your friends will receive a notification of your invitations
          </Text>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="black" />
            <TextInput
              placeholder="Search for friends..."
              value={searchTerm}
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
          </View>
          <View style={{ flex: 1 }}>
            {friendsToInvite.map((user, index) => (
              <ContactCard
                user={user.nonParticipant}
                status={user.status}
                key={index}
                isChecked={isChecked(user.nonParticipant.id)}
                setChecked={(e) => setChecked(e, user.nonParticipant.id)} />
            ))
            }
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={sendInvitations} style={styles.sendButton}>
              <Text style={{
                textAlign: 'center',
                color: 'white'
              }}>
                Send Invitations
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip}>
              <Text>Skip</Text>
            </TouchableOpacity>
          </View>
        </>
        :
        <NoFriendDisplay />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6E6E6",
    borderRadius: 15,
    borderWidth: 1,
    padding: 10,
    margin: 20,
  },
  searchInput: {
    padding: 5,
    flex: 1,
    height: 30,
    fontSize: 16,
    color: "black",
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    position: 'absolute',
    bottom: 90,
    width: '100%',
    zIndex: 99,
  },
  sendButton: {
    borderRadius: 13,
    borderWidth: 1,
    padding: 15,
    width: '90%',
    backgroundColor: 'blue',
    marginBottom: 15
  }
});

export default InvitePage;
