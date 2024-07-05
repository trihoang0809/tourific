import express from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { findMongoDBUser } from "../utils/index";

const router = express.Router();
const prisma = new PrismaClient();

// temporary for testing until auth done
const userID = "66860537f96086257c3f9792";

// Get all notification received by a user, descendingly
// /notification?type=FRIEND_ACCEPT
// /notification?type=TRIP_ACCEPT
router.get("/", async (req, res) => {
  const { type } = req.query;
  if (type === "FRIEND_ACCEPT") {
    try {
      // Logic to handle friend acceptance
      const notification = await prisma.notification.findMany({
        where: {
          receiverId: userID,
          type: "FRIEND_ACCEPT"
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sender: true
        }
      });

      if (!notification.length) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: `No friend-related notifications found for user with Id: ${userID}` });
      }
      res.status(StatusCodes.OK).json(notification);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `An error occurred while fetching friend-related notification for user profile with Id: ${userID}` });
    }
  } else if (type === "TRIP_ACCEPT") {
    try {
      // Logic to handle friend acceptance
      const notification = await prisma.notification.findMany({
        where: {
          receiverId: userID,
          type: "TRIP_ACCEPT"
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sender: true,
          trip: true,
        }
      });

      if (!notification.length) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: `No trip-related notifications found for user with Id: ${userID}` });
      }
      res.status(StatusCodes.OK).json(notification);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `An error occurred while fetching trip-related notification for user profile with Id: ${userID}` });
    }
  }
});

// Create a notification for a user
router.post("/", async (req, res) => {
  const { type, senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Sender and receiver IDs are required." });
  }

  const MongoDBUserId = await findMongoDBUser(senderId as string);
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        senderId: MongoDBUserId?.id as string,
        receiverId,
      },
    });
    res.status(StatusCodes.CREATED).json(notification);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while creating the notification." });
  }
});


export default router;
