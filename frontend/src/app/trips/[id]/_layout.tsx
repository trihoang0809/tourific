import { Stack } from 'expo-router/stack';

export default function TripLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
    </Stack>
  );
}
