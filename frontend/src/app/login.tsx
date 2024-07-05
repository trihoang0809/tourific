import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "@/screens/LoginScreen";

const Login = () => {
  // const { user } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/login");
  //   }
  // }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoginScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default Login;
