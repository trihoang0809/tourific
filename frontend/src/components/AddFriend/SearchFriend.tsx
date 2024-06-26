import { View, Text, SafeAreaView, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Style from 'Style';
import { Feather } from '@expo/vector-icons';
import ContactCardV2 from '../Avatar/ContactCardV2';

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

  // fetch all users
  // useEffect(() => {
  //   const searchUser = async (text: string) => {
  //     if (!text) return;  // Exit early if no search term
  //     console.log("searchTerm", text);
  //     try {
  //       const response = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/find`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ text }),
  //       });
  //       const data = await response.json();
  //       console.log(data);
  //       if (data.error) {
  //         throw new Error(data.error);
  //       }
  //       setSearchResults(data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setSearchResults([]);
  //     }
  //   };

  //   // find all friendship status
  //   const friends = async () => {
  //     try {
  //       const response = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/${userId}/friends`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const data = await response.json();
  //       console.log(data);
  //       if (data.error) {
  //         throw new Error(data.error);
  //       }

  //       const filterResult = searchResults.filter((result: any) => {
  //         if (data.find((friend: any) => friend.id === result.id)) {
  //           filterResult.push({ ...result, status: data.friendStatus });
  //         } 
  //       });
  //       // setSearchResults()
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  // }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      };

      try {
        // Fetch both resources in parallel
        const [searchResponse, friendsResponse] = await Promise.all([
          fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/find`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: searchTerm }),
          }),
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

        console.log("s", searchResults);
        console.log("f", friendsResults);
        // Create a map for quick lookup of friend status

        const enhancedS = searchResults.map(user => {
          const matchingFriend = friendsResults.find(friend => friend.receiverID === user.id || friend.senderID === user.id);
          return {
            ...user,
            friendStatus: matchingFriend ? matchingFriend.friendStatus : null
          };
        });

        console.log("result", enhancedS);

        // setSearchResults(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [searchTerm]);

  console.log("searchResults final", searchResults);

  const handleAddFriend = async (friendId: string) => {
    // const request = fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/add-friend`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ friendId: 1 }),
    // });
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
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View key={item.id}>
            <ContactCardV2 user={item} addFriend={handleAddFriend} />
          </View>
        )}
        ListEmptyComponent={<Text>No results found</Text>}
      />
    </SafeAreaView>
  );
};

export default SearchFriend;
