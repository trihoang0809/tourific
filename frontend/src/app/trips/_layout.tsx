import React from 'react'; // This import is often required for JSX transformation.
import { Redirect, Stack, Tabs } from 'expo-router';
import { ScrollView, View } from 'react-native';

const Layout = () => {
  return <Stack>
    <Stack.Screen name='index' options={{ title: 'Testing', headerShown: false }}
    />
  </Stack>;
};

export default Layout;