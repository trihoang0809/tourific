import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React from "react";
import { View, Text, FlatList } from "react-native";
const GOOGLE_MAP_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY || "undefined";
import { DataItem } from '@/types';;

export const LocationSearch = ({ onLocationSelected, value }: { onLocationSelected: (location: { address: string, citystate: string; }) => void; value: string; }) => {

  const data = [
    {
      id: "googlePlacesInput",
      component: <GooglePlacesAutocomplete
        ref={ref => {
          ref?.setAddressText(value);
        }}
        placeholder='Search a location'
        onPress={(data, details = null) => {
          console.log("location", data);
          console.log("street", data.structured_formatting.main_text);
          console.log("city-level location", data.structured_formatting.secondary_text);
          onLocationSelected({
            address: data.structured_formatting.main_text,
            citystate: data.structured_formatting.secondary_text,
          });
        }}
        keepResultsAfterBlur={true}
        query={{
          key: GOOGLE_MAP_API_KEY,
          language: 'en',
        }}
        styles={{
          // container: {
          //   backgroundColor: 'E6E6E6',
          // },
          // textInputContainer: {
          //   backgroundColor: 'E6E6E6',
          // },
          textInput: {
            color: 'black',
            fontSize: 15,
            backgroundColor: '#E6E6E6',
            padding: 15,
            marginTop: 5,
            borderRadius: 10
          },
          // predefinedPlacesDescription: {
          //   color: '#1faadb',
          // }
        }}
      />
    },
  ];

  const renderItem = ({ item }: { item: DataItem; }) => {
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