import express, { query } from "express";
import { PrismaClient, Status } from "@prisma/client";
import { StatusCodes } from 'http-status-codes';

const router = express.Router();
const prisma = new PrismaClient();

// temporary for testing until auth done
const userID = "6661308f193a6cd9e0ea4d36";

// get all user profiles
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

// find a user profile by username and email that matches the text
// case insensitive
router.post("/find", async (req, res) => {
  const { text } = req.body;
  try {
    const user = await prisma.user.findMany({
      where: {
        OR: [
          {
            userName: {
              startsWith: text,
              mode: 'insensitive',
            },
          },
          {
            email: {
              startsWith: text,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    res.status(StatusCodes.OK).json(user);
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while finding a user." });
  }
});

// Add a friend or cancel a friend request
router.post("/friend", async (req, res) => {
  const { friendId } = req.body;
  const userId = userID;
  const { add } = req.query;
  try {
    // cancel a sent request
    if (add === "false") {
      const cancelRequest = await prisma.friendship.delete({
        where: {
          receiverID_senderID: {
            senderID: userId,
            receiverID: friendId,
          },
        },
      });
      res.status(StatusCodes.OK).json(cancelRequest);
    } else if (add === "true") {
      // send a friend request

      // check if the friend request already exists
      const existingRequest = await prisma.friendship.findFirst({
        where: {
          OR: [
            {
              senderID: userId,
              receiverID: friendId,
            },
            {
              senderID: friendId,
              receiverID: userId,
            },
          ],
        },
      });

      if (existingRequest) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Friend request already exists." });
        return;
      }

      const friend = await prisma.friendship.create({
        data: {
          senderID: userId,
          receiverID: friendId,
        },
      });
      res.status(StatusCodes.CREATED).json(friend);
    }
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while adding/cancelling a friend." });
  }
});

// accept or decline a friend request
// to accept: /friend?accept=true 
// to reject: /friend?accept=false
router.patch("/friend", async (req, res) => {
  const { friendId } = req.body;
  const { accept } = req.query;
  const userId = userID;
  try {
    if (accept === "true") {
      const friend = await prisma.friendship.update({
        where: {
          receiverID_senderID: {
            senderID: friendId,
            receiverID: userId,
          },
        },
        data: {
          friendStatus: "ACCEPTED"
        },
      });
      res.status(StatusCodes.OK).json(friend);
    } else {
      const rejectFriend = await prisma.friendship.delete({
        where: {
          receiverID_senderID: {
            senderID: friendId,
            receiverID: userId,
          },
        },
      });
      res.status(StatusCodes.OK).json(rejectFriend);
    }
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while accepting/declining a friend." });
  }
});

// get all friendship by status
router.get("/:userId/friends", async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        // get all friends that have accepted the friend request
        OR: [
          {
            senderID: userId,
            friendStatus: status as Status,
            receiverID: {
              not: userId
            }
          },
          {
            receiverID: userId,
            friendStatus: status as Status,
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

// get all sent requests
router.get("/friend/sent-requests", async (req, res) => {
  const userId = userID;
  try {
    const sentRequests = await prisma.friendship.findMany({
      where: {
        senderID: userId,
        friendStatus: 'PENDING',
      },
    });
    res.status(StatusCodes.OK).json(sentRequests);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting sent friend requests." });
  }
});

// get all pending requests
router.get("/friend/pending-requests", async (req, res) => {
  const userId = userID;
  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverID: userId,
        friendStatus: 'PENDING',
      },
    });
    res.status(StatusCodes.OK).json(pendingRequests);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting pending friend requests." });
  }
});

export default router;
