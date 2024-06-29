import express from "express";
import { PrismaClient } from "@prisma/client";
import ActivityRouter from "./ActivityRouter";
import { validateData } from "../middleware/validationMiddleware";
import { tripCreateSchema } from "../schemas/tripSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { StatusCodes } from "http-status-codes";

// const express = require('express')
const router = express.Router();
const prisma = new PrismaClient();

export interface TripParams {
  tripId: string;
}

// Activites of a trip
router.use("/:tripId/activities", ActivityRouter);

// Get all trips
router.get("/", async (req, res) => {
  try {
    let queryConditions = {};
    const now = new Date();

    if (req.query.ongoing === "true") {
      queryConditions = {
        where: {
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
        },
      };
    } else if (req.query.past === "true") {
      queryConditions = {
        where: {
          endDate: {
            lt: now,
          },
        },
      };
    } else if (req.query.upcoming === "true") {
      // Fetch trips that start and end on a specific date
      if (typeof req.query.startTimeLocal === 'string' && typeof req.query.endTimeLocal === 'string') {
        const startOfDay = new Date(req.query.startTimeLocal);
        const endOfDay = new Date(req.query.endTimeLocal);
        console.log("Start of Day:", startOfDay);
        console.log("End of Day:", endOfDay);
        queryConditions = {
          where: {
            startDate: {
              gte: startOfDay,
              lte: endOfDay
            },
          },
        };
      } else {
        queryConditions = {
          where: {
            startDate: {
              gt: now,
            },
          },
        };
        // console.log(now);
      }
    }

    const trips = await prisma.trip.findMany(queryConditions);
    res.json(trips);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching trips." });
  }
});

router.post("/", async (req, res) => {
  const { name, startDate, endDate, location, image } = req.body;
  try {
    const trip = await prisma.trip.create({
      data: {
        name,
        startDate,
        endDate,
        location,
        image,
      },
    });
    res.status(201).json(trip);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the trip." });
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

// Create a new trip
router.post("/", validateData(tripCreateSchema), async (req, res) => {
  const { name, startDate, endDate, location, image } = req.body;
  try {
    const trip = await prisma.trip.create({
      data: {
        name: name,
        startDate,
        endDate,
        location,
        image,
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

// Update an existing trip
router.put("/:id", validateData(tripCreateSchema), async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  const { name, startDate, endDate, location, image } = req.body;
  console.log(req.body);
  const isValidID = await prisma.trip.findUnique({
    where: {
      id: id,
    },
  });

  if (!isValidID) {
    return res.status(404).json({ error: "Trip does not exist" });
  }

  try {
    const trip = await prisma.trip.update({
      where: {
        id,
      },
      data: {
        name: name,
        startDate: startDate,
        endDate: endDate,
        location: location,
        image,
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

export default router;
