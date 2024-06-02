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

export const categories: Record<string, string[]> = {
  Dining: [
    "restaurant",
    "cafe",
    "bakery",
    "bar",
    "meal_delivery",
    "meal_takeaway",
    "food",
  ],
  Entertainment: [
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
    "",
  ],
  Services: [
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
