import favicon from "@/assets/favicon.png";
import { TripData } from "../types";
export const mockTripData: TripData[] = [
  {
    name: "Trip to London",
    startDate: "2024-04-15",
    startHour: 9,
    endHour: 18,
    startMinute: 30,
    endMinute: 0,
    endDate: "2024-04-17",
    location: "London"
  },
  {
    name: "Exploring the Amazon",
    startDate: "2024-05-01",
    startHour: 8,
    endHour: 16,
    startMinute: 0,
    endMinute: 0,
    endDate: "2024-05-05",
    location: "Amazon Rainforest"
  },
  {
    name: "Business Trip to New York",
    startDate: "2024-06-10",
    startHour: 10,
    endHour: 17,
    startMinute: 0,
    endMinute: 0,
    endDate: "2024-06-12",
    location: "New York City"
  }
];

export default mockTripData;
