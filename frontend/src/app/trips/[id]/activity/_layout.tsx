import { Stack } from "expo-router/stack";

export default function activityCRUD() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="view" options={{ headerShown: false }} />
    </Stack>
  );
}
