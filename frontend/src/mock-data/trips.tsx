import favicon from "@/assets/favicon.png";
import { TripData } from "../types";
export const trips: TripData[] = [
  {
    id: '1',
    name: 'Trip to Paris',
    startDate: new Date(2024, 3, 16), // April 16, 2024
    startHour: 8,
    startMinute: 0,
    endHour: 20,
    endMinute: 30,
    endDate: new Date(2024, 3, 20), // April 20, 2024
    location: 'Paris',
    mapData: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
  }
];

export default trips;
