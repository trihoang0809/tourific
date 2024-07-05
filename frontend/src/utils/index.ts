import { Trip, TripData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// format follow UTC
export function formatDateTime(dateString: Date, hour: number, minute: number) {
  // "2024-04-01T07:00:00.000Z"
  if (!dateString) {
    return "Invalid date";
  }
  if (hour !== null) {
    dateString.setHours(hour);
  } else {
    dateString.setHours(8);
  }

  if (minute !== null) {
    dateString.setMinutes(minute);
  } else {
    dateString.setMinutes(0);
  }

  const isoString = dateString.toISOString();

  return isoString;
}

// extract date, start time, endtime
// @params: timestamp in UTC time zone and ISO format
// return an object with year, month, day, hour, minute
export function extractDateTime(timestamp: string) {
  if (!timestamp) {
    return { hour: 0, minute: 0 };
  }
  const date = new Date(timestamp);

  const extractedDateTime = {
    // year: date.getFullYear(),
    // month: date.getMonth() + 1, // Months are zero-indexed, so add 1
    // day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };

  return extractedDateTime;
}

export const tripDate = (date: Date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid date"; // Handle invalid dates
  }
  const month = date.toLocaleString("default", { month: "short" });
  return `${date.getDate()} ${month}, ${date.getFullYear()}`;
};

//weekday
export const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// function to get the most 3 recent upcoming trips
// @params: trips array
// return an array of 3 most recent upcoming trips
export function getRecentTrips(trips: Trip[]) {
  if (!trips) {
    return [];
  }

  const upcomingTrips = trips.sort(
    (a, b) => new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf(),
  );

  return upcomingTrips;
}

export function randomizeCover(images: string[]) {
  const idx = Math.floor(Math.random() * images.length);
  return images[idx];
}

export const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;

export const categories: Record<string, string[]> = {
  Dining: [
    "restaurant",
    "cafe",
    "bakery",
    "bar",
    "meal_delivery",
    "meal_takeaway",
    "food",
    "pizza_restaurant",
  ],
  Leisure: [
    "movie_theater",
    "night_club",
    "amusement_park",
    "museum",
    "library",
    "art_gallery",
    "bar",
    "tourist_attraction",
    "casino",
    "bowling_alley",
    "aquarium",
    "movie_rental",
    "book_store",
    "university",
    "zoo",
    "park",
    "establishment",
    "point_of_interest",
  ],
  OutdoorRecreation: [
    "park",
    "zoo",
    "campground",
    "aquarium",
    "university",
    "stadium",
    "city_hall",
    "church",
    "establishment",
  ],
  Shopping: [
    "clothing_store",
    "shopping_mall",
    "book_store",
    "jewelry_store",
    "liquor_store",
    "home_goods_store",
    "store",
    "furniture_store",
    "supermarket",
    "pet_store",
    "florist",
    "convenience_store",
    "movie_rental",
    "hardware_store",
    "department_store",
    "shoe_store",
  ],
  Services: [
    "local_government_office",
    "car_rental",
    "car_repair",
    "laundry",
    "bank",
    "accounting",
    "lawyer",
    "atm",
    "car_dealer",
    "plumber",
    "police",
    "post_office",
    "electrician",
    "electronics_store",
    "embassy",
    "fire_station",
    "storage",
  ],
  Transportation: [
    "airport",
    "transit_station",
    "train_station",
    "subway_station",
    "bus_station",
  ],
  Wellness: [
    "gym",
    "hair_care",
    "hospital",
    "spa",
    "doctor",
    "drugstore",
    "dentist",
    "pharmacy",
    "physiotherapist",
    "beauty_salon",
  ],
};

// Function to store the token
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("userToken", token);
    console.log("Token stored successfully ", token);
  } catch (error) {
    console.error("Error storing the token:", error);
  }
};

// Function to retrieve the token
export const getToken = async (): Promise<string | null> => {
  try {
    const token = AsyncStorage.getItem("userToken");
    console.log("Retrieved token: ", token);
    return await token;
  } catch (error) {
    console.error("Error retrieving the token:", error);
    return null;
  }
};

// Function to decode the token
export const decodeToken = (token: string): any => {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error decoding the token:", error);
    return null;
  }
};

// Function to retrieve the userId from the token
export const getUserIdFromToken = async (): Promise<string | null> => {
  const token = await getToken();
  if (token) {
    const decodedToken = decodeToken(token);
    const userId = decodedToken.user_id || decodedToken.sub; // Firebase stores user ID in 'sub'
    console.log("Decoded userId: ", userId);
    return userId || null;
  }
  return null;
};

export const defaultAvatar =
  "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg";

export const getTimeDuration = (createdAt: Date) => {
  const now = new Date();
  const notificationTime = new Date(createdAt);
  const diffInSeconds = Math.floor(
    (now.getTime() - notificationTime.getTime()) / 1000,
  );
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

export const createNotification = async (receiverId: string, senderId: string, type: string, tripId?: string) => {
  try {
    const req = {
      type: type,
      senderId: senderId,
      receiverId: receiverId,
      ...(tripId ? { tripId: tripId } : {})
    };
    const response = await fetch(
      `http://${EXPO_PUBLIC_HOST_URL}:3000/notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      },
    );
    if (!response.ok) {
      console.error("Failed to create notification");
    }
    const data = await response.json();
    console.log("Notification created:", data);
  } catch (error: any) {
    console.error("Error creating notification:", error.toString());
  }
};
