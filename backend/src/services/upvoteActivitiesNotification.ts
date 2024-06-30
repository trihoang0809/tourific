import { Expo } from "expo-server-sdk";
const fetch = require("fix-esm").require("node-fetch");

// Modify this to your device's push token to receive testing's notification
const TESTING_PUSH_TOKEN = "ExponentPushToken[KL2mQvAmxLKAOJvP_iiTlO]";

export interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  inviteeTripInvitations: TripMember[];
  inviterTripInvitations: TripMember[];
}

export interface TripMember {
  id: string;
  tripId: string;
  inviteeId: string;
  inviterId: string;
  trip: Trip;
  invitee: User;
  inviter: User;
}

export type Trip = {
  id: string;
  name: string;
  location: {
    address: string;
    citystate: string;
    latitude: number;
    longitude: number;
    radius: number;
  };
  startDate: Date;
  endDate: Date;
  image?: {
    height: number;
    width: number;
    url: string;
  };
  activities: ActivityProps[];
};

export interface ActivityProps {
  id: string;
}

const expo = new Expo();

async function queryUsersUpcomingTrips(): Promise<User[]> {
  const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL || "localhost";
  const response = await fetch(`http://${EXPO_PUBLIC_HOST_URL}:3000/user/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as User[];
}

async function sendPushNotification(expoPushToken: String, trip: Trip) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: `${trip.name}`,
    body: `"Help us plan this trip by upvoting activities you like!"`,
    data: { tripId: trip.id },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function sendUpvoteMoreActivitiesNotification() {
  try {
    // fetch all users, then for each of them, sort the upcoming trips they have in ascending order, then send notification to that trip
    const users = await queryUsersUpcomingTrips();
    // Send notification to first upcoming trip that doesn't have enough activity
    for (const user of users) {
      const upcomingTrips = user.inviteeTripInvitations.filter((tripMember) => {
        const trip = tripMember.trip;
        const tripDuration = (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 3600 * 24);
        return trip.activities.length < tripDuration;
      });

      if (upcomingTrips.length > 0) {
        const tripToNotify = upcomingTrips[0]; // Notify about the first trip
        await sendPushNotification(TESTING_PUSH_TOKEN, tripToNotify.trip);
        console.log("Successfully sent notifications to remind users to upvote more activities");
      }
    }
  } catch (error) {
    console.error("Error sending trip notification to remind users to upvote more activities", error);
  }
}

export { sendUpvoteMoreActivitiesNotification };
