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
import { any } from "zod";

// const express = require('express')
const router = express.Router();
const prisma = new PrismaClient();
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL;
const PORT = process.env.PORT || 3000;

export interface TripParams {
  tripId: string;
  userId: string;
}

const userID = "66806671b368fc776a512ad5";

// router.use(verifyToken);

// Activites of a trip
router.use("/:tripId/activities", ActivityRouter);

//Create Schedule
router.get("/:id/schedule", async (req, res) => {
  const { id } = req.params;

  try {
    // Get all activities user have created on their own
    const getActivities = async () => {
      try {
        const activities = await prisma.activity.findMany({
          where: {
            tripId: id,
            googlePlacesId: "",
          },
        });

        return activities;
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    // Get the trip data
    const getTripData = async () => {
      try {
        const trip = await prisma.trip.findUnique({
          where: {
            id,
          },
        });

        return trip;
      } catch (error) {
        console.log("An error happens while fetching trip " + error);
      }
    };

    // Add the activity to the calendar
    const addActivityToCalendar = async (activityId: string, isOnCalendar: boolean, startTime: Date, endTime: Date) => {
      const isValidID = await prisma.activity.findUnique({
        where: {
          id: activityId,
          tripId: id,
        },
      });

      if (!isValidID) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Activity does not exist" });
      }

      try {
        const activity = await prisma.activity.update({
          where: {
            id: activityId,
          },
          data: {
            isOnCalendar,
            startTime,
            endTime,
          },
        });
      } catch (error) {
        console.log("An error occurred while updating the activity.");
      }
    };

    // get all activities having upvote > 0
    const getActivitiesUpvote = async () => {
      try {
        const activities = await prisma.activity.findMany({
          where: {
            tripId: id,
            netUpvotes: { gt: 0 },
          },
        });

        return activities;
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    console.log("---------------------------");
    const userCreatedActivities = await getActivities();
    const upvoteActivities = await getActivitiesUpvote();
    const activities = userCreatedActivities.concat(upvoteActivities);
    const tripData = await getTripData();
    console.log(upvoteActivities);
    // Calculate days
    let startDate = tripData?.startDate.getTime() || 0;
    let endDate = tripData?.endDate.getTime() || 0;
    const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const schedule = await generateSchedule(JSON.stringify(activities), days, tripData?.participantsID.length || 1);

    for (let i = 0; i < schedule.length; ++i)
      for (let j = 0; j < schedule[i].route.length; ++j) {
        addActivityToCalendar(
          activities[schedule[i].route[j]].id,
          true,
          new Date(startDate + i * 24 * 60 * 60 * 1000),
          new Date(startDate + i * 24 * 60 * 60 * 1000)
        );
      }

    res.status(StatusCodes.OK).json(schedule);
  } catch (error) {
    console.log("An error occur while creating schedule: " + error);
  }
});

// Invitation route
router.use("/invite", InvitationRouter);

// Get all trips of a user
router.get("/", async (req: Request<TripParams>, res) => {
  console.log("Request body: ", req);
  const { firebaseUserId } = req.query;
  console.log("firebase User Id: ", firebaseUserId);

  try {
    let queryConditions: any = {
      where: {
        participantsID: {
          has: firebaseUserId,
        },
      },
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
    const trips = await prisma.tripMember.findMany({
      where: {
        inviteeId: userID,
        status: "ACCEPTED",
        trip: queryConditions.where,
      },
      include: {
        trip: true,
      },
    });
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
router.get("/:id/participants", async (req: Request<TripParams>, res) => {
  const { tripId } = req.params;
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
    res.json(participants);
  } catch (error) {
    console.error("Error retrieving trip participants:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while retrieving participants." }); // Send an error response
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
          { receiverID: userId, friendStatus: "ACCEPTED" },
          { senderID: userId, friendStatus: "ACCEPTED" },
        ],
      },
      include: {
        receiver: true,
      },
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
        status: true,
      },
    });

    if (!participants) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Trip not found" });
    }

    // Map participants to their status
    const participantIdsToStatus = new Map(participants.map((p) => [p.inviteeId, p.status]));

    // Filter and prepare data for friends not fully accepted into the trip
    const contactsNotInTrip = friends.reduce((acc: any, friend) => {
      const friendId = friend.receiverID === userId ? friend.senderID : friend.receiverID;
      const status = participantIdsToStatus.get(friendId);

      if (!status || status !== "ACCEPTED") {
        // check if not part of the trip or not accepted
        acc.push({
          receiver: friend.receiver,
          status: status || "NOT_INVITED", // return status or 'NOT_INVITED' if no status found (user has not been invited)
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
