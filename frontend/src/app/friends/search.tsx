import { View } from "react-native";
import React, {useEffect, useState} from "react";
import { Stack } from "expo-router";
import SearchFriend from "@/components/AddFriend/SearchFriend";

const search = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      <SearchFriend />
    </View>
  );
};

export default search;
