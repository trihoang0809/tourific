import express from "express";
import { PrismaClient } from "@prisma/client";
import TripRouter from "./routes/TripRouter";
import { connect } from "./db";
import UserProfile from "./routes/UserProfile";
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
// Get all trips
app.use("/trips", TripRouter);


// User Profile
app.use("/user", UserProfile);

// Connect to MongoDB via Prisma and start the server
const startServer = async () => {
  await connect();
  app.listen(port, () => {
    console.log(`Server running at http://${LOCAL_HOST_URL}:${port}`);
  });
};

startServer();
