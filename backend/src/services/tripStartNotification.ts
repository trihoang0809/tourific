import { Expo } from "expo-server-sdk";
const fetch = require("fix-esm").require("node-fetch");

// Modify this to your device's push token to receive testing's notification
const TESTING_PUSH_TOKEN = "ExponentPushToken[your_token_here]";

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
};

const expo = new Expo();

async function queryTripsStartingTomorrow(): Promise<Trip[]> {
  const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL || "localhost"; // Ensure this environment variable is set
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfTomorrowLocal = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
  const endOfTomorrowLocal = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString();

  const response = await fetch(
    `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?upcoming=true&startTimeLocal=${startOfTomorrowLocal}&endTimeLocal=${endOfTomorrowLocal}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as Trip[];
}

async function sendPushNotification(expoPushToken: String, trip: Trip) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: `${trip.name}`,
    body: `Your trip to ${trip.location.citystate} starts tomorrow!`,
    data: { tripId: trip.id }
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

async function sendTomorrowTripsStartNotifications() {
  try {
    const trips = await queryTripsStartingTomorrow();
    console.log("Upcoming trips that start tomorrow:", trips);

    for (const trip of trips) {
      // Will modify these commented lines based on BE of invite people to trip

      // for (const participant of trip.participants) {
      //   if (participant.status == "ACCEPTED")
      //   if (Expo.isExpoPushToken(participant.invitee.pushToken)) {
      //     await sendPushNotification(participant.pushToken, trip);
      //   } else {
      //     console.error(`Push token ${participant.pushToken} is not a valid Expo push token`);
      //   }
      // }

      // For now, send notification directly to your push token
      await sendPushNotification(TESTING_PUSH_TOKEN, trip);
    }
    console.log("Successfully sent notifications for trips starting tomorrow");
  } catch (error) {
    console.error("Error sending trip starting tomorrow notifications:", error);
  }
}

export { sendTomorrowTripsStartNotifications };
