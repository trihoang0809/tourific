import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import ActivityRouter from "./ActivityRouter";
import { validateData } from "../middleware/validationMiddleware";
import { tripCreateSchema } from "../schemas/tripSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../middleware/authMiddleware";
import { generateSchedule } from "../middleware/GenerateSchedule/schedule";
import InvitationRouter from "./InvitationRouter";
import { findMongoDBUser } from "src/utils";

// const express = require('express')
const router = express.Router();
const prisma = new PrismaClient();
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL;
const PORT = process.env.PORT || 3000;

export interface TripParams {
  tripId: string;
  userId: string;
}

// const userID = "66806671b368fc776a512ad5";

// router.use(verifyToken);

// Activites of a trip
router.use("/:tripId/activities", ActivityRouter);

//Create Schedule
router.get("/:id/schedule", async (req, res) => {
  const { id } = req.params;

  try {
    const getActivities = async () => {
      try {
        const activities = await prisma.activity.findMany({
          where: {
            tripId: id,
          },
        });

        return JSON.stringify(activities);
      } catch (error) {
        console.log(error);
        return [];
      }
    };
    const activities = await getActivities();

    const schedule = await generateSchedule(activities);
    // const data = JSON.parse(schedule);

    console.log(schedule);

    res.json(schedule);
  } catch (error) {
    console.log("An error occur while creating schedule: " + error);
  }
});

// Invitation route
router.use("/invite", InvitationRouter);

// Get all trips of a user
router.get("/", async (req: Request<TripParams>, res) => {
  console.log("Request body: ", req);
  const { firebaseUserId }: any = req.query;
  try {
    let queryConditions: any = {
      where: {},
    };
    const now = new Date();

    if (req.query.ongoing === "true") {
      queryConditions.where.AND = [
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
      ];
    } else if (req.query.past === "true") {
      queryConditions.where.endDate = {
        lt: now,
      };
    } else if (req.query.upcoming === "true") {
      queryConditions.where.startDate = {
        gt: now,
      };
    }
    console.log("query conditions: ", queryConditions);
    const MongoUserId = await prisma.user.findUnique({
      where: {
        firebaseUserId: firebaseUserId as string,
      },
      select: {
        id: true,
      },
    });

    console.log("MongoUserId: ", MongoUserId?.id);

    const trips = await prisma.tripMember.findMany({
      where: {
        inviteeId: MongoUserId?.id as string,
        status: "ACCEPTED",
        trip: queryConditions.where,
      },
      include: {
        trip: true,
      },
    });
    console.log("trips: ", trips);
    const tripData = trips.map((tripMember) => tripMember.trip);
    res.status(StatusCodes.OK).json(tripData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching trips." });
  }
});


// create a trip
router.post("/", validateData(tripCreateSchema), async (req, res) => {
  try {
    const { name, startDate, endDate, location, image, firebaseUserId } = req.body;
    const MongoDBUserId = await prisma.user.findUnique({
      where: {
        firebaseUserId: firebaseUserId as string,
      },
      select: {
        id: true,
      },
    }); const trip = await prisma.trip.create({
      data: {
        name,
        startDate,
        endDate,
        location,
        image,
        participants: {
          create: {
            inviteeId: MongoDBUserId?.id as string,
            inviterId: MongoDBUserId?.id as string,
            status: "ACCEPTED",
          },
        },
        participantsID: [firebaseUserId],
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
      include: {
        activities: true, // Include activities associated with the trip
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
    console.log("start running");
    const { id } = req.params;
    const { name, startDate, endDate, location, image, firebaseUserId } = req.body;

    const isValidID = await prisma.trip.findUnique({
      where: {
        id: id,
      },
    });

    if (!isValidID) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Trip does not exist" });
    }

    const trip = await prisma.trip.update({
      where: {
        id,
      },
      data: {
        name: name,
        startDate: startDate,
        endDate: endDate,
        location: location,
        image: image,
        participantsID: {
          push: firebaseUserId, // Add the userId to the participantsID array
        },
      },
    });
    res.status(StatusCodes.OK).json(trip);
  } catch (error) {
    console.log(error);
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
router.get("/:tripId/participants", async (req: Request<TripParams>, res) => {
  const { tripId } = req.params;
  console.log("tripId", tripId);
  try {
    const participants = await prisma.tripMember.findMany({
      where: {
        tripId: tripId,
        status: "ACCEPTED",
      },
      include: {
        invitee: true,
      },
    });
    res.status(StatusCodes.OK).json(participants);
  } catch (error) {
    console.error("Error retrieving trip participants:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while retrieving participants." }); // Send an error response
  }
});

// GET all contact/friends not in a group
router.get("/:id/non-participants", async (req, res) => {
  const { id: tripId } = req.params;
  const { firebaseUserId } = req.query;

  if (!firebaseUserId) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing firebaseUserId" });
  }

  const MongoUserId = await prisma.user.findUnique({
    where: {
      firebaseUserId: firebaseUserId as string,
    },
    select: {
      id: true,
    },
  });
  try {
    // Fetch all friends of the user where the friendship status is ACCEPTED
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { receiverID: MongoUserId?.id, friendStatus: "ACCEPTED" },
          { senderID: MongoUserId?.id, friendStatus: "ACCEPTED" },
        ],
      },
      include: {
        receiver: true,
        sender: true,
      }
    });
    console.log("friends", friends);

    if (!friends || friends.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "No friends found" });
    }

    // Fetch all trip members
    const participants = await prisma.tripMember.findMany({
      where: {
        tripId: tripId,
      },
      select: {
        inviteeId: true,
        inviterId: true,
        status: true,
      },
    });

    if (!participants) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Trip not found" });
    }

    console.log("participants", participants);
    // Map participants to their status
    const participantIdsToStatus = new Map(participants.map(p => [p.inviteeId, p.status]));
    console.log("participantIdsToStatus", participantIdsToStatus);

    // Filter and prepare data for friends not fully accepted into the trip
    const contactsNotInTrip = friends.reduce((acc: any, friend) => {
      const friendId = friend.receiverID === MongoUserId?.id ? friend.senderID : friend.receiverID;
      console.log("friendId", friendId);
      const status = participantIdsToStatus.get(friendId);
      console.log("status", status);

      if (!status || (status !== 'ACCEPTED' && status !== 'PENDING')) {  // check if not part of the trip or not accepted
        acc.push({
          receiver: friend.receiverID === MongoUserId?.id ? friend.sender : friend.receiver,
          status: status || 'NOT_INVITED'  // return status or 'NOT_INVITED' if no status found (user has not been invited)
        });
      }

      // filter out the user from the list of friends
      acc = acc.filter((contact: any) => contact.receiver.id !== MongoUserId?.id);

      return acc;
    }, []);

    res.status(StatusCodes.OK).json(contactsNotInTrip);
  } catch (error) {
    console.error("Failed to fetch contacts not in trip: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error");
  }
});

export default router;
