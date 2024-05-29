import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import ActivityRouter from "./ActivityRouter";
import { validateData } from "../middleware/validationMiddleware";
import { tripCreateSchema } from "../schemas/tripSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { StatusCodes } from "http-status-codes";
import InvitationRouter from "./InvitationRouter";

// const express = require('express')
const router = express.Router();
const prisma = new PrismaClient();
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL;
const PORT = process.env.PORT || 3000;


export interface TripParams {
  tripId: string;
  userId: string;
}

// temporary for testing until auth done
const userID = "664023f929694f249f1a4c86";

// Activites of a trip
router.use("/:tripId/activities", ActivityRouter);

// Invitation route
router.use("/invite", InvitationRouter);

// Get all trips of a user
router.get("/", async (req: Request<TripParams>, res) => {
  try {
    let queryConditions = {};
    const now = new Date();

    if (req.query.ongoing === "true") {
      queryConditions = {
        AND: [
          {
            startDate: {
              lt: now,
            },
          },
          {
            endDate: {
              gt: now,
            },
          },
        ],
      };
    } else if (req.query.past === "true") {
      queryConditions = {
        endDate: {
          lt: now,
        },
      };
    } else if (req.query.upcoming === "true") {
      queryConditions = {
        startDate: {
          gt: now,
        },
      };
      // console.log(now);
    }

    const trips = await prisma.tripMember.findMany({
      where: {
        status: 'ACCEPTED',
        trip: {
          AND: queryConditions
        }
      },
      include: {
        trip: true
      }
    });
    res.status(StatusCodes.OK).json(trips);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching trips." });
  }
});

// create a trip
router.post("/", validateData(tripCreateSchema), async (req, res) => {
  try {
    const { name, startDate, endDate, location, image } = req.body;
    const trip = await prisma.trip.create({
      data: {
        name,
        startDate,
        endDate,
        location,
        image,
        participants: {
          create: {
            inviteeId: userID,
            inviterId: userID,
            status: 'ACCEPTED'
          }
        }
      },
    });
    res.status(StatusCodes.CREATED).json(trip);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(StatusCodes.CONFLICT).json({ error: "A trip with the same details already exists." });
      }
    } else {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while creating the trip." });
    }
  }
});

// Get an existing trip
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const trip = await prisma.trip.findUnique({
      where: {
        id,
      },
    });
    res.status(StatusCodes.OK).json(trip);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching a trip." });
  }
});

// Update an existing trip
router.put("/:id", validateData(tripCreateSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, location, image } = req.body;
    const isValidID = await prisma.trip.findUnique({
      where: {
        id,
      },
    });

    if (!isValidID) {
      res.status(StatusCodes.NOT_FOUND);
    }

    const trip = await prisma.trip.update({
      where: {
        id,
      },
      data: {
        name,
        startDate,
        endDate,
        location,
        image
      },
    });
    res.status(StatusCodes.OK).json(trip);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating the trip." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const isValidID = await prisma.trip.findUnique({
      where: {
        id,
      },
    });

    if (!isValidID) {
      res.status(StatusCodes.NOT_FOUND);
    }

    const deletedTrip = await prisma.trip.delete({
      where: {
        id,
      },
    });
    res.status(StatusCodes.OK).json(deletedTrip);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while deleting the trip." });
  }
});

// GET all participant in a group
router.get("/:id/participants", async (req: Request<TripParams>, res) => {
  const { tripId } = req.params;  // Make sure you use 'id' as defined in the route or change your parameter destructuring to match the route definition
  try {
    const participants = await prisma.tripMember.findMany({
      where: {
        tripId: tripId,
        status: 'ACCEPTED'
      }
    });
    res.json(participants);  // Send the found participants back to the client
  } catch (error) {
    console.error("Error retrieving trip participants:", error);
    res.status(500).json({ error: "An error occurred while retrieving participants." });  // Send an error response
  }
});

// GET all contact/friends not in a group
router.get("/:id/non-participants", async (req, res) => {
  const { id: tripId } = req.params;
  const userId = userID;  // Assuming `req.userId` is set from an authentication middleware

  try {
    // Fetch all friends of the user where the friendship status is ACCEPTED
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { receiverID: userId, friendStatus: 'ACCEPTED' },
          { senderID: userId, friendStatus: 'ACCEPTED' }
        ]
      },
      include: {
        receiver: true,  // Assuming you want the receiver's data
      }
    });

    // Fetch all trip members who have ACCEPTED the invitation
    const participants = await prisma.tripMember.findMany({
      where: {
        tripId: tripId,
        status: 'ACCEPTED'
      }
    });

    // Prepare a set of participant IDs for quick lookup
    const participantIds = new Set(participants.map(participant => participant.inviteeId));

    // Filter friends to find those who are not participants of the trip
    const contactsNotInTrip = friends.filter(friend => {
      const friendId = friend.receiverID === userId ? friend.senderID : friend.receiverID;
      return !participantIds.has(friendId);
    });

    res.json(contactsNotInTrip);
  } catch (error) {
    console.error("Failed to fetch contacts not in trip: ", error);
    res.status(500).send("Server error");
  }
});


// DELETE PARTICIPANT OUT OF TRIPS


export default router;
