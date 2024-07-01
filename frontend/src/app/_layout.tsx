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
          name='trips'
          options={{
            title: 'Trip',
            headerShown: false
          }}
        />
        <Stack.Screen name="index"
          options={{
            headerShown: false,
          }} />
      </Stack>
    </QueryClientProvider>

  );
};

export default RootNavigation;
