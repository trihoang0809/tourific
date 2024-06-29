import * as Notifications from 'expo-notifications';
import { EXPO_PUBLIC_HOST_URL } from "@/utils";

async function queryTripsStartingTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfTomorrowLocal = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
  const endOfTomorrowLocal = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString();
  // const startDateParam = tomorrow.toISOString().split("T")[0];
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

  return await response.json();
}

async function sendNotificationsForUpcomingTrips() {
  try {
    const trips = await queryTripsStartingTomorrow();
    console.log('Upcoming trips that start tomorrow:', trips);

    for (const trip of trips) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${trip.name}`,
          body: `Your trip to ${trip.location.citystate} starts tomorrow!`,
        },
        trigger: null,
      });
    }

    console.log('Notifications sent for upcoming trips');
  } catch (error) {
    console.error('Error sending trip notifications frontend:', error);
  }
}

export { sendNotificationsForUpcomingTrips };