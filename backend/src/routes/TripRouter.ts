import express from "express";
import { PrismaClient } from "@prisma/client";
import ActivityRouter from "./ActivityRouter";

const router = express.Router();
const prisma = new PrismaClient();

export interface TripParams {
  tripId: string;
}

// Activites of a trip
router.use('/:tripId/activities', ActivityRouter);

// Get all trips
router.get("/", async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        activities: true, // Include activities associated with the trip
      },
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching trips." });
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
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching a trip." });
  }
});

// Create a new trip
router.post("/", async (req, res) => {
  const { name, startDate, endDate, location } = req.body;
  try {
    const trip = await prisma.trip.create({
      data: {
        name: name,
        startDate,
        endDate,
        location,
      },
    });
    res.status(201).json(trip);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the trip." });
  }
});

// Update an existing trip
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate, location } = req.body;
  try {
    const trip = await prisma.trip.update({
      where: {
        id,
      },
      data: {
        name,
        startDate,
        endDate,
        location,
      },
    });
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the trip." });
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
    res.status(200).json(deletedTrip);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the trip." });
  }
});

export default router;
