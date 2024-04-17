export function formatDateTime(dateString: Date, hour: number, minute: number) {
  // "2024-04-01T07:00:00.000Z"
  const year = dateString.getUTCFullYear(); // Get the year
  const month = dateString.getUTCMonth() + 1; // Get the month (0-indexed, so add 1)
  const day = dateString.getUTCDate();

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