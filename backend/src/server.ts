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
const { scheduleTripNotifications } = require("./services/tripNotification");
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

app.use(express.json());
app.use(cors());

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: `http://${LOCAL_HOST_URL}:8081`,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Get all trips
app.use("/trips", TripRouter);

// User Profile
app.use("/user", UserProfile);

// Connect to MongoDB via Prisma and start the server
const startServer = async () => {
  await connect();
  // app.listen(port, () => {
  //   console.log(`Server running at http://${LOCAL_HOST_URL}:${port}`);
  // });
  server.listen(port, () => console.log(`Server running at http://${LOCAL_HOST_URL}:${port}`));
  scheduleTripNotifications(io);
};

startServer();

// Add messages when sockets open and close connections
io.on("connection", (socket: Socket) => {
  console.log(`[${socket.id}] socket connected`);
  socket.on("disconnect", (reason) => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});
