import express, { query } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from 'http-status-codes';

const router = express.Router();
const prisma = new PrismaClient();

// temporary for testing until auth done
const userID = "6669267e34f4cab1d9ddd751";

// get all user for testing
router.get("/", async (req, res) => {
  try {
    const userProfile = await prisma.user.findMany();
    res.status(StatusCodes.OK).json(userProfile);
  }
  catch (error) {
    console.log("Some errors happen while getting user profile");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `An error occurred while` });
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
      include: {
        inviteeTripInvitations: true,
        inviterTripInvitations: true
      }
    });

    if (!userProfile) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `There is no user with Id: ${userId}` });
    }
    res.status(StatusCodes.OK).json(userProfile);
  }
  catch (error) {
    console.log("Some errors happen while getting user profile");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `An error occurred while fetching activity with Id: ${userId}` });
  }
});

// Create a user profile
router.post("/", async (req, res) => {
  const { userName, email, password, firstName, lastName, dateOfBirth, avatar } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        avatar,
      },
    });
    res.status(StatusCodes.CREATED).json(user);
  }
  catch (error) {
    console.log("Some errors happen while creating user profile");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `An error occurred while creating activity with` });
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
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating the user profile." });
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
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while deleting the user profile." });
  }
});

// Add a friend
router.post("/add-friend", async (req, res) => {
  const { friendId } = req.body;
  const userId = userID;

  try {
    const friend = await prisma.friendship.create({
      data: {
        senderID: userId,
        receiverID: friendId,
      },
    });
    res.status(StatusCodes.CREATED).json(friend);
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while adding a friend." });
  }
});

// accept a friend request
router.patch("/friend/accept", async (req, res) => {
  const { friendId } = req.body;
  const userId = userID;

  try {
    const friend = await prisma.friendship.update({
      where: {
        receiverID_senderID: {
          senderID: friendId,
          receiverID: userId,
        },
      },
      data: {
        friendStatus: "ACCEPTED",
      },
    });
    res.status(StatusCodes.OK).json(friend);
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while accepting a friend." });
  }
});

// reject a friend request
router.patch("/friend/reject", async (req, res) => {
  const { friendId } = req.body;
  const userId = userID;
  try {
    const friend = await prisma.friendship.update({
      where: {
        receiverID_senderID: {
          senderID: friendId,
          receiverID: userId,
        },
      },
      data: {
        friendStatus: "REJECTED",
      },
    });
    res.status(StatusCodes.OK).json(friend);
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while rejecting a friend." });
  }
});

// get all friends
router.get("/:userId/friends", async (req, res) => {
  const { userId } = req.params;
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        // get all friends that have accepted the friend request
        OR: [
          {
            senderID: userId,
            friendStatus: "ACCEPTED",
            receiverID: {
              not: userId
            }
          },
          {
            receiverID: userId,
            friendStatus: "ACCEPTED",
            senderID: {
              not: userId
            }
          },
        ],
      },
    });
    res.status(StatusCodes.OK).json(friends);
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting friends." });
  }
});

export default router;
