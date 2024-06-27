import { View, Text, SafeAreaView, TextInput, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Style from 'Style';
import { Feather } from '@expo/vector-icons';
import ContactCardV2 from '../Avatar/ContactCardV2';
import { FriendRequest, FriendSearch, User } from '@/types';

const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;
const userId = '6661308f193a6cd9e0ea4d36';
const SearchFriend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (text: string) => {
    console.log("text", text);
    setSearchTerm(text);
    if (!text) {
      setSearchResults([]);
      console.log("No search term");
    }
  };

  // search users
  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      };

      try {
        const [searchResponse, friendsResponse] = await Promise.all([
          // find username and email by keyword
          fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/find`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: searchTerm }),
          }),
          // find friends by user id
          fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/${userId}/friends`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        // Convert both responses to JSON
        const [searchResults, friendsResults] = await Promise.all([
          searchResponse.json(),
          friendsResponse.json(),
        ]);

        // map search results to include friend status
        const enhancedS = searchResults.map((user: User) => {
          const matchingFriend = friendsResults.find((friend: FriendRequest) => friend.receiverID === user.id || friend.senderID === user.id);
          return {
            ...user,
            friendStatus: matchingFriend ? matchingFriend.friendStatus : null
          };
        });

        // filter user themselves
        const filteredS = enhancedS.filter((user: FriendSearch) => user.id !== userId);

        console.log("result", filteredS);

        setSearchResults(filteredS);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    // set timeout to prevent too many requests
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  console.log("searchResults final", searchResults);

  const handleAddFriend = async (friendId: string) => {
    try {
      const request = fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/friend?add=true`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: friendId }),
      });

      if (!request.ok) {
        Alert.alert("Failed to send friend request");
      }
      // const result = await request.json();
      // console.log("result", result);
    } catch (error) {

    }
  };

  const cancelFriendRequest = async (friendId: string) => {
    try {
      console.log("frinedi", friendId);
      const request = fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/friend?add=false`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: friendId }),
      });

      if (!request.ok) {
        Alert.alert("Failed to cancel friend request");
      }
      const result = await request.json();
      console.log("result", result);
    } catch (error) {
      console.error("Failed to cancel friend request", error);
    }
  };
  return (
    <SafeAreaView style={{ height: '100%', paddingTop: 40, backgroundColor: '#fff' }}>
      <View style={Style.searchContainer}>
        <Feather name="search" size={20} color="black" />
        <TextInput
          placeholder="Search for people..."
          value={searchTerm}
          onChangeText={handleSearch}
          style={Style.searchInput}
        />
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item: FriendSearch) => item.id}
        renderItem={({ item }) => (
          <View key={item.id}>
            <ContactCardV2 user={item} addFriend={handleAddFriend} cancelFriendRequest={cancelFriendRequest} />
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 10 }}>No results found</Text>}
      />
    </SafeAreaView>
  );
};

export default SearchFriend;
