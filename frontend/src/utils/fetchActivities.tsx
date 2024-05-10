import { useState, useEffect } from "react";
import { ActivityProps } from "@/types";

export const fetchActivities = (
  latitude: number,
  longitude: number,
  radius: number,
): ActivityProps[] => {
  const [activities, setActivities] = useState<ActivityProps[]>([]);
  const GOOGLE_PLACES_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "undefined";

  const getImageUrl = (photos: any, apiKey: any) => {
    if (photos && photos.length > 0) {
      const photoReference = photos[0].photo_reference;
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;
    }
    return "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0";
  };

  useEffect(() => {
    const doFetch = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        const activitiesData: ActivityProps[] = data.results.map(
          (place: any) => ({
            id: place.place_id,
            name: place.name,
            description: "",
            imageUrl: getImageUrl(place.photos, GOOGLE_PLACES_API_KEY),
            location: {
              citystate: place.vicinity,
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            },
            notes: "",
            netUpvotes: 0,
            isOnCalendar: false,
            category: place.types,
            rating: place.rating,
          }),
        );

        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    doFetch();
  }, [latitude, longitude, radius]);

  return activities;
};
