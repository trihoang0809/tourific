import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, StatusBar } from "react-native";
import { Button } from "../components/Button";
import GooglePlacesInput from "../components/GooglePlacesInput";

export const MockTripCreate: React.FC = () => {

  const handlePress = () => {
    console.log("Button Pressed");
  };

  // State to store the selected location
  const [selectedLocation, setSelectedLocation] = useState({ latitude: 0, longitude: 0 });

  // Define custom data structure for FlatList
  const data = [
    {
      id: "text",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    { id: "googlePlacesInput", component: <GooglePlacesInput /> },
    {
      id: "additionalText",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];

  type DataItem = {
    id: string;
    component?: JSX.Element; // component property is optional and can contain JSX.Element
    content?: string; // content property is optional and can contain string
  };

  const renderItem = ({ item }: { item: DataItem }) => {
    if (item.component) {
      return item.component;
    } else {
      return (
        <View>
          <Text style={styles.content}>{item.content}</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Render FlatList for GooglePlacesInput */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scroll}
      />
      {/* Button outside of FlatList */}
      <Button title="Submit" onPress={handlePress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  scroll: {
    paddingHorizontal: 20,
  },
});
