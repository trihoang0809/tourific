import express from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const router = express.Router();
const prisma = new PrismaClient();

// Get all user profiles
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching activities." });
  }
});

// Get a user profile
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userProfile) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `There is no user with Id: ${userId}` });
    }
    res.status(StatusCodes.OK).json(userProfile);
  } catch (error) {
    console.log("Some errors happen while getting user profile");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `An error occurred while fetching user profile with Id: ${userId}` });
  }
});

// Create a user profile
router.post("/", async (req, res) => {
  const { userName, password, firstName, lastName, dateOfBirth, avatar } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        userName,
        password,
        firstName,
        lastName,
        dateOfBirth,
        avatar,
      },
    });
    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    console.log("Some errors happen while creating user profile");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `An error occurred while creating user profile` });
  }
});

// Update a user profile
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { userName, password, firstName, lastName, dateOfBirth, avatar } = req.body;
  if (!id) {
    res.status(StatusCodes.NOT_FOUND).json({ error: "ID does not exist" });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        userName,
        password,
        firstName,
        lastName,
        dateOfBirth,
        avatar,
      },
    });
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `An error occurred while updating the user profile with id: ${id}` });
  }
});

// Delete a user profile
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(StatusCodes.NOT_FOUND).json({ error: "ID does not exist" });
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `An error occurred while deleting the user profile with id: ${id}` });
  }
});
export default router;
