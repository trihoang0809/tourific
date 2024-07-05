import React from "react"; // This import is often required for JSX transformation.
import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="search"
        options={{
          title: "Add friends",
          headerShown: true,
          headerTitleAlign: "center",
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.navigate("/home")}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
