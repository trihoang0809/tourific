import express from "express";
import { PrismaClient } from "@prisma/client";
// const express = require('express')
const router = express.Router();
const prisma = new PrismaClient();

// Get trips

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
      queryConditions = {
        where: {
          startDate: {
            gt: now,
          },
        },
      };
      console.log(now);
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

export default router;
