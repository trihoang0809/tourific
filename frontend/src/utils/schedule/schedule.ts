import { activityData } from "./prepareData";

export const scheduleTrip = async (tripId: String) => {
  const serverUrl = process.env.EXPO_PUBLIC_HOST_URL;

  // Fetch trip's activities
  const getSchedule = async (activityDistance: any) => {
    const url = `http://${serverUrl}:3000/trips/${tripId}/schedule`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ distance: activityDistance }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }

      const data = await response.json();

      // console.log(data);
      return data;
    } catch (error: any) {
      console.error("Error fetching creating schedule", error.toString());
      return [];
    }
  };

  let userActivityDistance: any = await activityData(tripId);
  let schedule = await getSchedule(userActivityDistance);

  return schedule;
};
