import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { View } from 'react-native';

export default function TabLayout() {
  const { id } = useLocalSearchParams();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'navy', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          // headerShown: false,
          // headerTransparent: true,
          headerTitle: '',
          // headerRight: () => (
          //   <Link href={`/trips/create?id=${id}`}>
          //     <View style={{
          //       backgroundColor: 'rgba(0, 0, 128, 0.3)', // This sets the background color to black with 10% opacity
          //       borderRadius: 50,
          //       padding: 5,
          //     }}>
          //       <Feather
          //         // onPressIn={showMoreSetting}
          //         // onPressOut={notShowMoreSetting}
          //         name="edit-2"
          //         size={24}
          //         color="black" />
          //     </View>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Suggestions',
          tabBarIcon: ({ color }) => <AntDesign name="find" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{
          title: 'Itinerary',
          tabBarIcon: ({ color }) => <AntDesign name="calendar" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
