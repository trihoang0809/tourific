import React from 'react'; // This import is often required for JSX transformation.
import { Redirect, Stack, Tabs } from 'expo-router';
import { ScrollView, View } from 'react-native';

// this should be our home page, list all the trips that we have
const Layout = () => {
  return <Stack>
    <Stack.Screen
      name='[id]'
      options={{
        title: 'Testing',
        headerShown: false,
      }} />
    {/* <Stack.Screen name="upcoming" options={{ headerShown: false }} /> */}
  </Stack>;
};

export default Layout;