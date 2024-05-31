import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, Stack } from "expo-router";
import { HomeScreen } from "../screens/HomeScreen";
import sampleUser from "@/mock-data/userNickDoan";

const Home = () => {
  // const { user } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/login");
  //   }
  // }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomeScreen user={sampleUser} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default Home;
