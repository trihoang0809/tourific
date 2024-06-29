import io, { Socket } from "socket.io-client";
import { EXPO_PUBLIC_HOST_URL } from "@/utils";
import { sendNotificationsForUpcomingTrips } from "./notificationService";

const socketEndpoint = `http://${EXPO_PUBLIC_HOST_URL}:3000`;
let socket: Socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(socketEndpoint, {
      transports: ["websocket"],
    });

    socket.io.on("open", () => console.log("Socket connected"));
    socket.io.on("close", () => console.log("Socket disconnected"));

    socket.on("CHECK_UPCOMING_TRIPS", async () => {
      console.log("Received CHECK_UPCOMING_TRIPS event");
      await sendNotificationsForUpcomingTrips();
    });
  }
};

export const getSocket = () => socket;
