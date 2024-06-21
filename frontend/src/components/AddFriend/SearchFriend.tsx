import { View, Text, SafeAreaView, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Style from 'Style';
import { Feather } from '@expo/vector-icons';

const SearchFriend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text) {
    } else {
    }
  };

  return (
    <SafeAreaView style={{ paddingTop: 40 }}>
      <View style={Style.searchContainer}>
        <Feather name="search" size={20} color="black" />
        <TextInput
          placeholder="Search for people..."
          value={searchTerm}
          onChangeText={handleSearch}
          style={Style.searchInput}
        />
      </View>
      <View>
        <Text>From your contacts</Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchFriend;
