import express = require("express");
import { PrismaClient } from "@prisma/client";
import TripRouter from "./routes/TripRouter";
import { connect } from "./db";

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

// Get all trips
app.use("/trips", TripRouter);

// Connect to MongoDB via Prisma and start the server
const startServer = async () => {
  await connect();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();
