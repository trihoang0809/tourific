import React from "react"; // This import is often required for JSX transformation.
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="search"
        options={{ title: "Search", headerShown: false }}
      />
    </Stack>
  );
};

export default Layout;
