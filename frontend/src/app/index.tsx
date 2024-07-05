import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "@/screens/LoginScreen";
import { getToken } from "@/utils";
import { Redirect } from "expo-router";
const App = () => {
  const isLoggedIn = getToken();
  // const { user } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/login");
  //   }
  // }, [user]);

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LoginScreen />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <Redirect href="/(tabs)/home" />
    // <SafeAreaView className="flex-1 bg-white">
    //   {/* <HomeScreen user={sampleUser} /> */}
    //   <LoginScreen />
    //   <StatusBar style="auto" />
    // </SafeAreaView>
  );
};

export default App;
