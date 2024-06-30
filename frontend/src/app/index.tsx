import React from 'react';
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from "@/mock-data/user";

export default function App() {
  return (
      <HomeScreen user={sampleUser} />
  );
}
