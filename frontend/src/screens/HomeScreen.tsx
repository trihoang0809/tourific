import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TripCard } from "../components/TripCard";
import { HomeScreenHeader } from "../components/HomeScreenHeader";
import { useState, useEffect } from "react";
import { UserProps, Trip } from "../types";

export const HomeScreen: React.FC<UserProps> = ({ user }) => {
  const [ongoingTrip, setOngoingTrip] = useState<Trip | null>(null);
  useEffect(() => {
    const fetchOngoingTrips = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/trips?ongoing=true",
        );
        const data = await response.json();
        setOngoingTrip(data);
      } catch (error) {
        console.error("Failed to fetch ongoing trip:", error);
      }
    };

    fetchOngoingTrips();
  }, []);

  return (
    <View style={styles.container}>
      <HomeScreenHeader user={user} />
      <Text style={styles.title}>Hello {user.firstName}</Text>
      {ongoingTrip && <TripCard trip={ongoingTrip} />}{" "}
      {/* Conditional rendering based on the presence of ongoingTrip */}
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
