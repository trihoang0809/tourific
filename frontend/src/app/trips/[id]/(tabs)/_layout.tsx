import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { View, Text } from 'react-native'

export default function TabLayout() {
  const { id } = useLocalSearchParams();

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#006ee6', 
      headerShown: false, 
      tabBarStyle : {
        height: 70, // Adjust this value as needed
        justifyContent: 'center',
        paddingVertical: 5,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerShown: true, 
          headerTransparent: true,
          headerTitle: '',
          headerRight: () => (
            <Link href={`/trip/create?id=${id}`}>
              <View style={{
                backgroundColor: '#004999', // This sets the background color to black with 10% opacity
                borderRadius: 50,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Feather
                  // onPressIn={showMoreSetting}
                  // onPressOut={notShowMoreSetting}
                  name="edit-2"
                  size={20}
                  color="white" />
                <Text style={{marginLeft:10, color:"white"}}>Edit</Text>
              </View>
          </Link>
          ),
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
