import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { TripParams } from "./TripRouter";

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

interface ActivityParams extends TripParams {
  activityId: string;
}

// type ActivityParams = { activityId: string } & TripParams;

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await prisma.activity.findMany();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching activities." });
  }
});

// Get an activity
router.get("/:activityId", async (req: Request<ActivityParams>, res) => {
  const { activityId, tripId } = req.params;
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: activityId,
        tripId: tripId,
      },
    });
    if (!activity) {
      res.status(404).json({ error: `There is no activity with Id: ${activityId}` });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: `An error occurred while fetching activity with Id: ${activityId}` });
  }
});

// Create a new activity
router.post("/", async (req: Request<ActivityParams>, res) => {
  const { tripId } = req.params;
  const { name, description, startTime, endTime, location, notes, image } = req.body;

  if (!tripId) {
    res.status(404).json({ error: "ID does not exist" });
  }
  try {
    const activity = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        activities: {
          create: {
            name,
            description,
            startTime,
            endTime,
            location,
            notes,
            image,
          },
        },
      },
    });
    res.status(201).json(activity);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the activity." });
  }
});

// Update an activity
router.put("/:activityId", async (req: Request<ActivityParams>, res) => {
  const { activityId: activityId, tripId } = req.params;
  const { name, description, startTime, endTime, location, notes, image } = req.body;

  const isValidID = await prisma.activity.findUnique({
    where: {
      id: activityId,
      tripId: tripId,
    },
  });

  if (!isValidID) {
    res.status(404).json({ error: "Activity does not exist" });
  }

  try {
    const activity = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        name,
        description,
        startTime,
        endTime,
        location,
        notes,
        image,
      },
    });
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the activity." });
  }
});

// Delete an activity
router.delete("/:activityId", async (req: Request<ActivityParams>, res) => {
  const { activityId: activityId, tripId } = req.params;
  try {
    const deletedActivity = await prisma.activity.delete({
      where: {
        id: activityId,
        tripId: tripId,
      },
    });
    res.status(200).json(deletedActivity);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the activity." });
  }
});

export default router;
