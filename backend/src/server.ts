import express from "express";
import { PrismaClient } from "@prisma/client";
import { connect } from "./db";
import TripRouter from "./routes/TripRouter";
import UserProfile from "./routes/UserProfile";
import ActivityRouter from "./routes/ActivityRouter";

const app = express();
const cors = require('cors');
const timeout = require('express-timeout');
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit"); 
const port = process.env.PORT || 3000;
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL;

const prisma = new PrismaClient();

app.use(express.json());
const {
  corsOptions,
  PORT,
  TIMEOUT,
  RATE_LIMITER
} = require('./configs/configs');

app.use(cors(corsOptions));

// Body parser configuration
app.use(express.json());


// Compression
app.use(compression());
    
// timeout
app.use(timeout(TIMEOUT));

// Trip route
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
