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

//  Delete an existing trip
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

// GET all participant in a trip
router.get("/:id/participants", async (req: Request<TripParams>, res) => {
  const { tripId } = req.params;
  try {
    const participants = await prisma.tripMember.findMany({
      where: {
        tripId: tripId,
        status: 'ACCEPTED'
      }
    });
    res.json(participants);
  } catch (error) {
    console.error("Error retrieving trip participants:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while retrieving participants." });  // Send an error response
  }
});

// GET all contact/friends not in a group
router.get("/:id/non-participants", async (req, res) => {
  const { id: tripId } = req.params;
  const userId = userID;
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
        receiver: true,
      }
    });
    console.log("friends", friends);

    if (!friends || friends.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "No friends found" });
    }

    // Fetch all trip members who have not ACCEPTED the invitation
    const participants = await prisma.tripMember.findMany({
      where: {
        tripId: tripId,
        // status: { not: 'ACCEPTED' }
      },
      select: {
        inviteeId: true,
        status: true,
      }
    });

    console.log("part", participants);

    if (!participants) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Trip not found" });
    }

    // map non participants with status
    // const participantIdsToStatus = new Map(participants.map(participant => [participant.inviteeId, participant.status]));

    // const total: { receiver: { id: string; userName: string; password: string; firstName: string; lastName: string; dateOfBirth: Date; } & { avatar: { height: number; width: number; url: string; }; }; status: string | undefined; }[] = [];
    // const contactsNotInTrip = friends.filter(friend => {
    //   if (!participantIdsToStatus.has(friend.receiverID)) {
    //     total.push({
    //       receiver: friend.receiver,
    //       status: 'NOT_INVITED'
    //     });
    //   } else {
    //     if (participantIdsToStatus.get(friend.receiverID) !== 'ACCEPTED') {
    //       total.push({
    //         receiver: friend.receiver,
    //         status: participantIdsToStatus.get(friend.receiverID)
    //       });
    //     }
    //   }
    // });

    // res.json(total);
    // Map participants to their status
    const participantIdsToStatus = new Map(participants.map(p => [p.inviteeId, p.status]));

    // Filter and prepare data for friends not fully accepted into the trip
    const contactsNotInTrip = friends.reduce((acc: any, friend) => {
      const friendId = friend.receiverID === userId ? friend.senderID : friend.receiverID;
      const status = participantIdsToStatus.get(friendId);

      if (!status || status !== 'ACCEPTED') {  // Check if not part of the trip or not accepted
        acc.push({
          receiver: friend.receiver,
          status: status || 'NOT_INVITED'  // Provide status or 'NOT_INVITED' if no status found
        });
      }
      return acc;
    }, []);

    res.json(contactsNotInTrip);
  } catch (error) {
    console.error("Failed to fetch contacts not in trip: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
  }
});


// DELETE PARTICIPANT OUT OF TRIPS


export default router;
