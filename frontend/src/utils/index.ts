import { isLeapYear } from "react-native-paper-dates/lib/typescript/Date/dateUtils";

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

export const EXPO_PUBLIC_HOST_URL = process.env.EXPO_PUBLIC_HOST_URL;
