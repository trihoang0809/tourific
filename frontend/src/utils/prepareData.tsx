import { ActivityProps } from "@/types";

export const activityData = async (tripId: String) => {
  const GOOGLE_PLACES_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "undefined";
  const serverUrl = process.env.EXPO_PUBLIC_HOST_URL;

  // Fetch trip's activities
  const getChosenActivity = async () => {
    console.log(tripId);
    const url = `http://${serverUrl}:3000/trips/${tripId}/activities`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }

      const data = await response.json();

      for (let i = 0; i < data.length; ++i) {
        data[i] = {
          id: data[i].id,
          name: data[i].name,
          description: data[i].description,
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlCeVhPcF0B061dWx6Y2p6ZshztnAoVQI59g&s",
          startTime: data[i].startTime,
          endTime: data[i].endTime,
          location: data[i].location,
          notes: data[i].notes,
          netUpvotes: data[i].netUpvotes,
          isOnCalendar: data[i].isOnCalendar,
          category: data[i].category,
          rating: data[i].rating,
        };
      }
      // console.log(data);
      return data;
    } catch (error: any) {
      console.error("Error fetching trip:", error.toString());
      return [];
    }
  };

  const getDistance = async (
    originLa: number,
    originLong: number,
    destinationLa: number,
    destinationLong: number,
  ) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLa},${originLong}&destination=${destinationLa},${destinationLong}&mode=driving&key=${GOOGLE_PLACES_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      // console.log(data.routes[0].legs[0].distance.value);
      return data.routes[0].legs[0].distance.value;
    } catch (error) {
      console.log("An error happens while fetching ggMap Direction: " + error);
    }
  };

  let userActivityData = await getChosenActivity();
  console.log(userActivityData.length);
  let userActivityDistance: any = [];

  for (let i = 0; i < userActivityData.length; ++i) {
    userActivityDistance.push([]);
    for (let j = 0; j < userActivityData.length; ++j)
      userActivityDistance[i].push(0);
  }

  for (let i = 0; i < userActivityData.length; ++i) {
    for (let j = i + 1; j < userActivityData.length; ++j) {
      const distance = await getDistance(
        userActivityData[i].location.latitude,
        userActivityData[i].location.longitude,
        userActivityData[j].location.latitude,
        userActivityData[j].location.longitude,
      );
      userActivityDistance[i][j] = distance;
      userActivityDistance[j][i] = distance;
    }
  }

  console.log(userActivityDistance);
};
