import express from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();

const saltRounds = 10; // The cost factor for bcrypt

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
router.get("/:firebaseUserId", async (req, res) => {
  const { firebaseUserId } = req.params;
  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        firebaseUserId: firebaseUserId,
      },
    });

    if (!userProfile) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `There is no user with Id: ${firebaseUserId}` });
    }
    res.status(StatusCodes.OK).json(userProfile);
  } catch (error) {
    console.log("Some errors happen while getting user profile");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `An error occurred while fetching user profile with Id: ${firebaseUserId}` });
  }
});

// Create a user profile
router.post("/", async (req, res) => {
  const { userName, email, password, firstName, lastName, dateOfBirth, avatar, firebaseUserId } = req.body;

  // Validate the email format and password strength
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid email format" });
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error:
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number",
    });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateOfBirth)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid date of birth format. Use YYYY-MM-DD." });
  }
  const parsedDateOfBirth = new Date(dateOfBirth);
  if (isNaN(parsedDateOfBirth.getTime())) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid date of birth." });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ userName }, { email }],
      },
    });

    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ error: "Username or email is already in use" });
    }
    console.log("all good up to here!");

    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password
    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword, // Store the hashed password
        firstName,
        lastName,
        dateOfBirth: parsedDateOfBirth,
        avatar,
        firebaseUserId,
      },
    });
    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    console.log("Some errors happened while creating the user profile:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while creating the user profile" });
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
router.post("/friend/:userId", async (req, res) => {
  const { friendId } = req.body;
  const userId = req.params.userId;
  try {
    const friend = await prisma.friendship.create({
      data: {
        senderID: userId,
        receiverID: friendId,
      },
    });
    res.status(StatusCodes.CREATED).json(friend);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while adding a friend." });
  }
});

// get all friends
router.get("/friend/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        // get all friends that have accepted the friend request
        OR: [
          {
            senderID: userId,
            friendStatus: "ACCEPTED",
            receiverID: {
              not: userId,
            },
          },
          {
            receiverID: userId,
            friendStatus: "ACCEPTED",
            senderID: {
              not: userId,
            },
          },
        ],
      },
    });
    res.status(StatusCodes.OK).json(friends);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while getting sent friend requests." });
  }
});

// accept or decline a friend request
// to accept: /friend?accept=true
// to reject: /friend?accept=false
router.patch("/friend/:userId", async (req, res) => {
  const { friendId } = req.body;
  const { accept } = req.query;
  const userId = req.params.userId;
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
          friendStatus: "ACCEPTED",
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
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while accepting/declining a friend." });
  }
});

// get all sent requests
router.get("/friend/:userId/sent-requests", async (req, res) => {
  const userId = req.params.userId;
  try {
    const sentRequests = await prisma.friendship.findMany({
      where: {
        senderID: userId,
        friendStatus: "PENDING",
      },
    });
    res.status(StatusCodes.OK).json(sentRequests);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while getting sent friend requests." });
  }
});

// get all pending requests
router.get("/friend/:userId/pending-requests", async (req, res) => {
  const userId = req.params.userId;
  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverID: userId,
        friendStatus: "PENDING",
      },
    });
    res.status(StatusCodes.OK).json(pendingRequests);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while getting pending friend requests." });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid email or password" });
    }

    res.status(StatusCodes.OK).json({ message: "Login successful", user });
  } catch (error) {
    console.log("Some errors happened while logging in:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while logging in" });
  }
});

export default router;
