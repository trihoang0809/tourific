import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, Stack } from 'expo-router';
import PopupMenu from '@/components/PopupMenu/PopupMenu';
import { HomeScreen } from "../screens/HomeScreen";
import sampleUser from '@/mock-data/userNickDoan';

export default function App() {
  // return (
  //   <View className="flex-1 bg-white items-center justify-center">
  //     <Text>Open up app/index.tsx to start working on your app!</Text>
  //     <Link href='/trips/2'>Go to trip detail page</Link>
  //     <Link href='/trips/661f78b88c72a65f2f6e49d4'>Go to trip at the beach</Link>
  //     <Link href='/trips/create'>Go to trip create</Link>
  //     <StatusBar style="auto" />
  //     {/* <App /> */}
  //   </View>
    
  // );

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <HomeScreen user={sampleUser} />
      <Link href="userProfile/userProfileUI">userProfile</Link>
    </View>
  );
}
