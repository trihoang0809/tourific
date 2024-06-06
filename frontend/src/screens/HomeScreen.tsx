import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Pressable,
} from "react-native";
import { TripCard } from "../components/TripCard";
import { HomeScreenHeader } from "../components/HomeScreenHeader";
import { useState, useEffect } from "react";
import { UserProps, Trip, Invitation } from "../types";
import { Link, router } from 'expo-router';
import { EXPO_PUBLIC_HOST_URL } from "@/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import InvitationCard from "@/components/Invitation/InvitationCard";

export const HomeScreen: React.FC<UserProps> = ({ user }) => {
  const [ongoingTrips, setOngoingTrips] = useState<Trip[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [invitation, setInvitation] = useState<Invitation[]>([]);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const ongoing = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips?ongoing=true`);
        const upcoming = await fetch(
          `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?upcoming=true`,
        );
        const ongoingData = await ongoing.json();
        const upcomingData = await upcoming.json();

        setOngoingTrips(ongoingData.trip);
        setUpcomingTrips(upcomingData);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      }
    };
    fetchTrips();
  }, []);

  console.log("up", upcomingTrips);
  console.log("on", ongoingTrips);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const invitations = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips/invite/all-received`);
        const invites = await invitations.json();
        setInvitation(invites);
      } catch (error) {
        console.error("Failed to fetch invitations", error);
      }
    };

    fetchInvitations();
  }, []);

  console.log("inv", invitation);
  const onAccept = async (id: string) => {
    try {
      console.log("accepting", id);
      const sendAccept = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips/invite/${id}/accept`, {
        method: "PATCH",
      });

      if (!sendAccept.ok) {
        throw new Error("Failed to accept invitation");
      }

      const newInvitations = invitation.filter((invite) => invite.id !== id);
      setInvitation(newInvitations);

      const acceptedInvite = await sendAccept.json();
      if (acceptedInvite.trip) {
        router.replace(`/trips/${acceptedInvite.trip.id}`);
      }
    } catch (error) {
      console.error("Failed to accept invitation", error);
    }
  };

  const onDecline = async (id: string) => {
    try {
      const sendDecline = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/trips/invite/${id}/decline`, {
        method: "PATCH",
      });

      if (!sendDecline.ok) {
        throw new Error("Failed to decline invitation");
      }

      const newInvitations = invitation.filter((invite) => invite.id !== id);
      setInvitation(newInvitations);
    } catch (error) {
      console.error("Failed to decline invitation", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <HomeScreenHeader user={user} />
        <Text style={styles.greeting}>Welcome back, {user.firstName}!</Text>
        <ScrollView>
          {invitation.map((invite: Invitation) => (
            <InvitationCard key={invite.id} invitation={invite} onAccept={onAccept} onDecline={onDecline} />
          ))}
        </ScrollView>
        <Text style={styles.title}>Ongoing Trips</Text>
        <ScrollView horizontal={true} style={styles.tripScroll}>
          {ongoingTrips?.length > 0 ? (
            ongoingTrips.map((trip) => (
              <TripCard key={trip.tripId} trip={trip.trip} height={250} width={400} />
            ))
          ) : (
            <Text style={styles.noTrip}>No ongoing trips</Text>
          )}
        </ScrollView>
        <Pressable style={styles.buttonContainer}>
          <Link href="/trips/create" style={styles.button}>
            <Text style={styles.buttonText}>Create a new trip</Text>
          </Link>
        </Pressable>

        <View style={styles.upcoming}>
          <Text style={styles.title}>Upcoming Trips</Text>
          <Button
            title="See all"
            onPress={() => {
              router.replace("/trips/upcoming");
            }}
          />
        </View>

        <ScrollView horizontal={true} style={styles.tripScroll}>
          {upcomingTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip.trip} height={200} width={200} />
          ))}
        </ScrollView>
      </SafeAreaView>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginTop: 10,
    width: 200,
    alignItems: "center",
    textAlign: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  upcoming: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});
