import { ActivityDetail } from "@/screens/ActivityScreen/ActivityDetail";
import { useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";

const viewActivity = () => {
  const { id } = useGlobalSearchParams();
  const { activityid } = useGlobalSearchParams();
  const GOOGLE_PLACES_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "undefined";
  useEffect(() => {
    const fetchGG = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?fields=editorial_summary&place_id=${activityid}&key=${GOOGLE_PLACES_API_KEY}`;
        // const url = `https://places.googleapis.com/v1/places/${activityid}?fields=id,displayName&key=${GOOGLE_PLACES_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log("An error occur while fetching ggMap API");
      }
    };

    fetchGG();
  });

  return (
    <ActivityDetail
      tripId={String(id)}
      actID={String(activityid)}
    ></ActivityDetail>
  );
};

export default viewActivity;
