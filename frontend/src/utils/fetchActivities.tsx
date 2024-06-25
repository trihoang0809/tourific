import { ActivityProps } from "@/types";

export const fetchActivities = async (
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
      id: "",
      ggMapId: place.place_id,
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
    }));
    return activitiesData;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};
