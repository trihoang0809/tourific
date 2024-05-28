import React, { useEffect, useState } from "react";
import { Slot, Stack } from "expo-router";

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
    <Stack initialRouteName="login/index">
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="login/index"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="register/index"
        options={{ title: "Register", headerShown: false }}
      />
    </Stack>
  );
};

export default RootNavigation;
