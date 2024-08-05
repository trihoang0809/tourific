import { Stack } from "expo-router/stack";

export default function SuggestionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[activityid]" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerTitle: "Create a new trip", headerShown: false }} />
    </Stack>
  );
}
