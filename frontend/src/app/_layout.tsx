import React, { useEffect, useState } from "react";
import { Slot, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const RootNavigation = () => {
  // const { user } = useAuth();
  // const [initialRoute, setInitialRoute] = useState("login");

  // useEffect(() => {
  //   if (user) {
  //     setInitialRoute("index");
  //   } else {
  //     setInitialRoute("login");
  //   }
  // }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="trips"
          options={{ title: "Trip", headerShown: false }}
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="friends" options={{ headerShown: false }} />
        <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen
          name="userProfile/profile"
          options={{ title: "Profile", headerShown: true }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootNavigation;
