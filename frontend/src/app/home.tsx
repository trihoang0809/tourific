import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from "@/mock-data/user";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "@/types";
import { getToken, decodeToken } from "@/utils";

const fetchUserInfo = async (userId: string): Promise<User> => {
  // Replace with your actual backend API call
  const response = await fetch(
    `http://${process.env.EXPO_PUBLIC_HOST_URL}:3000/user/${userId}`,
  );
  const data = await response.json();
  return data;
};

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const initializeUser = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const decodedToken = decodeToken(token);
      const userId = decodedToken.user_id || decodedToken.sub;

      if (!userId) {
        router.replace("/login");
        return;
      }

      try {
        const userInfo = await fetchUserInfo(userId);
        // console.log("got the user right here: ", userInfo);
        console.log("Home file: ", userId);
        setUser(userInfo);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        router.replace("/login");
      }
    };

    initializeUser();
  }, [router]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <HomeScreen user={user} />
      <StatusBar style="auto" />
    </>
  );
};

export default Home;
