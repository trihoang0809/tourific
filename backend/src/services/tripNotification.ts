const cron = require("node-cron");
import { Server as SocketIOServer } from 'socket.io';

function scheduleTripNotifications(io: SocketIOServer) {
  // For production, send this notification every day at midnight UTC
  // cron.schedule("0 0 * * * *", async () => {
  
  // For testing, send this notification every 10 seconds
  cron.schedule("*/20 * * * * *", async () => {
    console.log("Running trip notification task:", new Date().toISOString());
    io.emit('CHECK_UPCOMING_TRIPS');
    console.log("Sent CHECK_UPCOMING_TRIPS event to all clients");
  });

  console.log("Fetch and notify trip start tomorrow task scheduled");
}
module.exports = { scheduleTripNotifications };
