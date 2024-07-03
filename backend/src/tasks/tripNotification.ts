const cron = require("node-cron");
import { sendTomorrowTripsStartNotifications } from "../services/tripStartNotification";

function scheduleTripNotifications() {
  // For production, run this cron job every day at midnight UTC
  cron.schedule("0 0 * * * *", async () => {

  // For testing, run this cron job every 20 seconds
  // cron.schedule("*/20 * * * * *", async () => {
  
    try {
      await sendTomorrowTripsStartNotifications();
      console.log("Successfully scheduled task to notify tomorrow's trip");
    } catch (error) {
      console.error("Error in schedule task to notify tomorrow's trip:", error);
    }
  });
}
module.exports = { scheduleTripNotifications };
