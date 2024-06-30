const cron = require("node-cron");
import { sendTomorrowTripsStartNotifications } from "../services/tripStartNotification";
import { sendUpvoteMoreActivitiesNotification } from "../services/upvoteActivitiesNotification";

function scheduleTripNotifications() {
  // For production, run this cron job every day at midnight UTC
  // cron.schedule("0 0 * * * *", async () => {

  // For testing, run this cron job every 20 seconds
  // You can modify this line to schedule the frequency of the task
  cron.schedule("*/20 * * * * *", async () => {
    try {
      await sendTomorrowTripsStartNotifications();
      console.log("Successfully scheduled task to notify tomorrow's trip");
    } catch (error) {
      console.error("Error in schedule task to notify tomorrow's trip:", error);
    }
  });

  cron.schedule("*/20 * * * * *", async () => {
    // For testing, run every 20 seconds
    // cron.schedule("0 0 * * 0", async () => { // For production: Run at midnight (0 hours and 0 minutes) on Sunday
    try {
      await sendUpvoteMoreActivitiesNotification();
      console.log("Successfully scheduled task to remind users to upvote more activities");
    } catch (error) {
      console.error("Error in schedule task to remind users to upvote more activities:", error);
    }
  });
}

module.exports = { scheduleTripNotifications };
