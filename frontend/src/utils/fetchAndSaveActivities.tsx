import { Activity, ActivityProps } from "@/types";

export const fetchGoogleActivities = async (
  latitude: number,
  longitude: number,
  radius: number,
) => {
  const GOOGLE_PLACES_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "undefined";

  const getImageUrl = (photos: any, apiKey: string) => {
    if (photos && photos.length > 0) {
      const photoReference = photos[0].photo_reference;
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;
    }
    return "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0";
  };

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const activitiesData: ActivityProps[] = data.results.map((place: any) => ({
      name: place.name,
      description: "",
      imageUrl: getImageUrl(place.photos, GOOGLE_PLACES_API_KEY),
      location: {
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      },
      notes: "",
      netUpvotes: 0,
      isOnCalendar: false,
      category: place.types,
      rating: place.rating,
      googlePlacesId: place.place_id,
    }));
    return activitiesData;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export const fetchActivities = async (
  tripId: string | string[] | undefined,
): Promise<ActivityProps[]> => {
  const response = await fetch(
    `http://${process.env.EXPO_PUBLIC_HOST_URL}:3000/trips/${tripId}/activities`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }
  return response.json();
};

export const saveActivitiesToBackend = async (
  tripId: string,
  activities: ActivityProps[],
) => {
  console.log("trip ID!: ", tripId);
  const promises = activities.map(async (activity) => {
    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_HOST_URL}:3000/trips/${tripId}/activities`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activity.name,
          description: activity.description,
          imageUrl: activity.imageUrl,
          startTime: new Date(),
          endTime: new Date(),
          location: {
            citystate: activity.location.citystate,
            latitude: activity.location.latitude,
            longitude: activity.location.longitude,
          },
          notes: activity.notes,
          netUpvotes: activity.netUpvotes,
          isOnCalendar: activity.isOnCalendar,
          category: activity.category,
          rating: activity.rating,
          googlePlacesId: activity.googlePlacesId,
        }),
      },
    );
    return response.json();
  });
};
