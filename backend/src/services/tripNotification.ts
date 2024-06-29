const cron = require("node-cron");
import { Server as SocketIOServer } from 'socket.io';

function scheduleTripNotifications(io: SocketIOServer) {
  // For production, send this notification every 1 day
  // cron.schedule("* * * 1 * *", async () => {
  
  // For testing, send this notification every 10 seconds
  cron.schedule("0,10,20,30,40,50 * * * * *", async () => {
    console.log("Running trip notification task:", new Date().toISOString());
    io.emit('CHECK_UPCOMING_TRIPS');
    console.log("Sent CHECK_UPCOMING_TRIPS event to all clients");
  });

  console.log("Trip notification task scheduled");
}
module.exports = { scheduleTripNotifications };
