import express from "express";
import { PrismaClient } from "@prisma/client";
import TripRouter from "./routes/TripRouter";
import UserProfile from "./routes/UserProfile";
import { connect } from "./db";
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Get all trips
app.use("/trips", TripRouter);

app.use("/", UserProfile);

// Connect to MongoDB via Prisma and start the server
const startServer = async () => {
  await connect();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();
