import React from "react"; // This import is often required for JSX transformation.
import { Stack } from "expo-router";

// this should be our home page, list all the trips that we have
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{ title: "Testing", headerShown: false }}
      />
    </Stack>
  );
};

export default Layout;
