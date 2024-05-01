import { useState, useEffect } from "react";
import { MapData } from "@/types";

export type ActivityData = {
  id: string;
  name: string;
  description: string;
  startTime: {
    hours: number;
    minutes: number;
  };
  endTime: {
    hours: number;
    minutes: number;
  };
  location: MapData;
  notes: string;
  netUpvotes: number;
  isOnCalendar: boolean;
  category: string[];
};

type ActivitiesProps = {
  latitude: string;
  longitude: string;
  radius: number;
};

export const useFetchActivities = ({
  latitude,
  longitude,
  radius,
}: ActivitiesProps): ActivityData[] => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const GOOGLE_PLACES_API_KEY =
    process.env.REACT_APP_GOOGLE_PLACES_API_KEY || "";

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: `${latitude},${longitude}`,
            radius: radius,
            key: GOOGLE_PLACES_API_KEY,
          }),
        });
        const data = await response.json();

        const activitiesData: ActivityData[] = data.results.map(
          (place: any) => ({
            id: place.place_id,
            name: place.name,
            location: {
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            },
            netUpvotes: 0,
            isOnCalendar: false,
            category: place.types,
          }),
        );

        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [latitude, longitude, radius]);

  return activities;
};
