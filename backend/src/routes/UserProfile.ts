import express, { Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const router = express.Router();
const prisma = new PrismaClient();

// temporary for testing until auth done
const userID = "6661308f193a6cd9e0ea4d36";

// Get all user profiles
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching users." });
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

// Add a friend
router.post("/friend", async (req, res) => {
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

// get friend requests by status
// get list of friends: /friend?status=ACCEPTED
// get pending friend requests: /friend?status=PENDING 
router.get("/friend", async (req: Request, res) => {
  const userId = userID;
  const { status } = req.query;
  try {
    if (status === "ACCEPTED") {
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
    } else if (status === "PENDING") {
      const friendRequests = await prisma.friendship.findMany({
        where: {
          receiverID: userId,
          friendStatus: "PENDING",
        },
      });
      res.status(StatusCodes.OK).json(friendRequests);
    }
  }
  catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting sent friend requests." });
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

// get all sent friend requests
router.get("/friend/sent-requests", async (req, res) => {
  const userId = userID;
  const sentRequests = await prisma.friendship.findMany({
    where: {
      senderID: userId,
      friendStatus: status as Prisma.EnumStatusFilter<"Friendship"> | undefined,
    },
  });
  res.status(StatusCodes.OK).json(sentRequests);
});
export default router;
