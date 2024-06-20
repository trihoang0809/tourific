import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React, { useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
const GOOGLE_MAP_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY || "undefined";
import { DataItem } from "@/types";
import { AntDesign } from "@expo/vector-icons";
export const LocationSearch = ({
  onLocationSelected,
  onChange,
  value,
}: {
  onLocationSelected: (location: {
    address: string;
    citystate: string;
  }) => void;
  onChange: (text: string) => void;
  value: string;
}) => {
  const data = [
    {
      id: "googlePlacesInput",
      component: (
        <GooglePlacesAutocomplete
          textInputProps={{
            value: value === "undefined" ? null : value,
            onChangeText: onChange,
          }}
          placeholder="Search a location"
          onPress={(data, details = null) => {
            // console.log("location", data);
            // console.log("street", data.structured_formatting.main_text);
            // console.log(
            //   "city-level location",
            //   data.structured_formatting.secondary_text,
            // );
            onLocationSelected({
              address: data.structured_formatting.main_text,
              citystate: data.structured_formatting.secondary_text,
            });
            onChange(
              data.structured_formatting.main_text +
                " " +
                data.structured_formatting.secondary_text,
            );
          }}
          keepResultsAfterBlur={true}
          query={{
            key: GOOGLE_MAP_API_KEY,
            language: "en",
          }}
          styles={{
            // container: {
            //   backgroundColor: 'E6E6E6',
            // },
            // textInputContainer: {
            //   backgroundColor: 'E6E6E6',
            // },
            textInput: {
              color: "black",
              fontSize: 15,
              backgroundColor: "#E6E6E6",
              // backgroundColor: "white",
              padding: 50,
              marginTop: 5,
              borderRadius: 10,
            },
            // predefinedPlacesDescription: {
            //   color: '#1faadb',
            // }
          }}
        />
      ),
    },
  ];

  const renderItem = ({ item }: { item: DataItem }) => {
    if (item.component) {
      return item.component;
    } else {
      return (
        <View>
          <Text>{item.content}</Text>
        </View>
      );
    }
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
};
