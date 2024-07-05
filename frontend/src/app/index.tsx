import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, Stack } from "expo-router";
import { HomeScreen } from "../screens/HomeScreen";
import LoginScreen from "./login";
import {LogBox} from 'react-native';

// Ignore log notification by message
LogBox.ignoreLogs([
  // Exact message
  'Warning: componentWillReceiveProps has been renamed',

  // Substring or regex match
  /GraphQL error: .*/,
]);

// Ignore all log notifications
LogBox.ignoreAllLogs();


const App = () => {
  // const { user } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/login");
  //   }
  // }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* <HomeScreen user={sampleUser} /> */}
      <LoginScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default App;
