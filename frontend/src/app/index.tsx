import React from 'react';
import { HomeScreen } from "../screens/HomeScreen";
import { sampleUser } from "@/mock-data/user";
import { Link } from 'expo-router';

export default function App() {
  return (
    <HomeScreen user={sampleUser} />
  );
}
