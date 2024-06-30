import { Stack } from "expo-router/stack";

export default function ItineraryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "Itinerary" }} />
      <Stack.Screen
        name="[itineraryid]"
        options={{ headerShown: true, title: "View event" }}
      />
    </Stack>
  );
}
