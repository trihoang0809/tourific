import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TripCard } from "../components/TripCard";
import { HomeScreenHeader } from "../components/HomeScreenHeader";
import { useState, useEffect } from "react";
import { UserProps, Trip } from "../types";

export const HomeScreen: React.FC<UserProps> = ({ user }) => {
  const [ongoingTrips, setOngoingTrips] = useState<Trip[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const ongoing = await fetch("http://localhost:3000/trips?ongoing=true");
        const upcoming = await fetch(
          "http://localhost:3000/trips?upcoming=true",
        );
        const ongoingData = await ongoing.json();
        const upcomingData = await upcoming.json();

        setOngoingTrips(ongoingData);
        setUpcomingTrips(upcomingData);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <HomeScreenHeader user={user} />
      <Text style={styles.greeting}>Welcome back, {user.firstName}!</Text>
      <Text style={styles.title}>Ongoing Trips</Text>
      <ScrollView horizontal={true} style={styles.tripScroll}>
        {ongoingTrips.length > 0 ? (
          ongoingTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <Text style={styles.noTrip}>No ongoing trips</Text>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* navigate to create trip */
          }}
        >
          <Text style={styles.buttonText}>Create a new trip</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Upcoming Trips</Text>
      <ScrollView horizontal={true} style={styles.tripScroll}>
        {upcomingTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    justifyContent: "flex-start",
    fontSize: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
  tripScroll: {},
  noTrip: {
    fontSize: 16,
    color: "red",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
