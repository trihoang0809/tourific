import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../components/Button";
import { TripCard } from "../components/TripCard";
import { HomeScreenHeader } from "../components/HomeScreenHeader";

type Trip = {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  image?: {
    height: number;
    width: number;
    url: string;
  };
};

type User = {
  id: string;
  username: string;
  password: string;
  friendRequestReceived: [];
  tripID: [];
  trips: Trip[];
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  avatar: {
    height: number;
    width: number;
    url: string;
  };
};

interface UserProps {
  user: User;
}

export const HomeScreen: React.FC<UserProps> = ({ user }) => {
  const handlePress = () => {
    console.log("Button Pressed");
  };

  return (
    <View style={styles.container}>
      <View>
        <HomeScreenHeader user={user} />
      </View>
      {/* work from here */}
      <Text style={styles.title}>Welcome to Tourific!</Text>
      <Button title="Discover More" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
