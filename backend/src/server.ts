import express from "express";
import { PrismaClient } from "@prisma/client";
import { connect } from "./db";
import TripRouter from "./routes/TripRouter";
import UserProfile from "./routes/UserProfile";
import NotificationRouter from "./routes/NotificationRouter";
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL;

const prisma = new PrismaClient();
const { scheduleTripNotifications } = require("./tasks/tripNotification");

app.use(express.json());
app.use(cors());

// Trip route
app.use("/trips", TripRouter);

// User Profile
app.use("/user", UserProfile);

// Notification
app.use("/notification", NotificationRouter);

// Connect to MongoDB via Prisma and start the server
const startServer = async () => {
  await connect();
  app.listen(port, () => {
    console.log(`Server running at http://${LOCAL_HOST_URL}:${port}`);
  });
  scheduleTripNotifications();
};

startServer();

