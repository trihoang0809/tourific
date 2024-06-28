import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { scheduleNotificationAsync } from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import { EXPO_PUBLIC_HOST_URL, getRecentTrips, randomizeCover } from "@/utils";
import { Trip } from "@/types";

// Define the task name
const PRINT_NUMBER = "PRINT_NUMBER";
const NOTIFY_UPCOMING_TRIPS = "NOTIFY_UPCOMING_TRIPS";

TaskManager.defineTask(PRINT_NUMBER, async () => {
  try {
    // Query the database for trips starting tomorrow
    console.log("at", Date.now(), "print", Math.random())
    return "success";
  } catch (error) {
    console.error("Error in PRINT_NUMBER", error);
    return;
  }
});

// Register the task
TaskManager.defineTask(NOTIFY_UPCOMING_TRIPS, async () => {
  try {
    // Query the database for trips starting tomorrow
    const tripsStartingTomorrow = await queryTripsStartingTomorrow();
    // Schedule notifications for each trip
    for (const trip of tripsStartingTomorrow) {
      await scheduleNotificationForTrip(trip);
      console.log("trip to be notified", trip, "start on", trip.startDate)
    }
    return "success";
  } catch (error) {
    console.error("Error in NOTIFY_UPCOMING_TRIPS task:", error);
    return;
  }
});

// Function to query trips starting tomorrow
async function queryTripsStartingTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startDateParam = tomorrow.toISOString().split("T")[0];
  const response = await fetch(
    `http://${EXPO_PUBLIC_HOST_URL}:3000/trips?upcoming=true&startDate=${startDateParam}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const trips = await response.json();
  console.log("upcoming trip tmr", trips)
  return trips;
}

// Function to schedule a notification for a trip
async function scheduleNotificationForTrip(trip: Trip) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Trip Reminder",
      body: `Your trip to ${trip.location.citystate} starts tomorrow!`,
    },
    trigger: {
      seconds: 1, // Send immediately (as the task is already scheduled for the day before)
    },
  });
}

// Schedule the daily task
export async function scheduleDailyTask() {
  const options = {
    // minimumInterval: 60 * 60 * 24, // 24 hours in seconds
    minimumInterval: 10, // 10 seconds for testing
    stopOnTerminate: false, // Continue task if the app is terminated
    startOnBoot: true, // Start task after device reboot
  };
  await BackgroundFetch.registerTaskAsync(NOTIFY_UPCOMING_TRIPS, options);
  console.log("Background task registered with options:", options);
}

// Call this function to set up the daily task
// scheduleDailyTask();
