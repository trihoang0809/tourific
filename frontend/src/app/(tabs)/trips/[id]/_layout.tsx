import React, { useState, useEffect } from "react";
import { Stack, router, Link, useGlobalSearchParams } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;

export default function TripLayout({}) {
  const { id } = useGlobalSearchParams();
  const [tripName, setTripName] = useState();

  const getTrip = async ({ id: text }: { id: string }) => {
    try {
      console.log(EXPO_PUBLIC_HOST_URL);
      const response = await fetch(
        `http://${EXPO_PUBLIC_HOST_URL}:3000/trips/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }
      const data = await response.json();
      setTripName(data.name);
    } catch (error: any) {
      console.error("Error fetching trip:", error.toString());
    }
  };
  useEffect(() => {
    if (typeof id === "string") {
      getTrip({ id });
    }
  }, []);

  return (
    <Stack initialRouteName="Trip home">
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          headerTitle: tripName,
          headerTitleAlign: "center",
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.navigate("/home")}
            />
          ),
          headerRight: () => (
            <Link href={`/trips/create?id=${id}`}>
              <Feather
                // onPressIn={showMoreSetting}
                // onPressOut={notShowMoreSetting}
                name="edit-2"
                size={20}
                color="black"
              />
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
