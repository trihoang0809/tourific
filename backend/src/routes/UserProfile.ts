import express from "express";
import { PrismaClient, Status } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { findMongoDBUser } from "../utils/index";

const router = express.Router();
const prisma = new PrismaClient();

const saltRounds = 10; // The cost factor for bcrypt

// Get all user profiles
router.get("/", async (req, res) => {
  // Get all users with their 3 most recent upcoming trips
  try {
    let queryConditions = {};
    if (req.query.upcoming === "true") {
      queryConditions = {
        where: {
          inviteeTripInvitations: {
            some: {
              status: "ACCEPTED",
              trip: {
                endDate: {
                  gt: new Date(), // Filter for upcoming trips
                },
              },
            },
          },
        },
        include: {
          inviteeTripInvitations: {
            include: {
              trip: {
                include: {
                  activities: true,
                },
              },
            },
            orderBy: {
              trip: {
                startDate: "asc", // Order trips by start date ascending
              },
            },
            take: 3, // Get only 3 the earliest upcoming trips
          },
        },
      };
    }
    const users = await prisma.user.findMany(queryConditions);
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
      return res.status(StatusCodes.NOT_FOUND).json({ error: `There is no user with Id: ${firebaseUserId}` });
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
router.post("/:id/friends", async (req, res) => {
  const { friendId } = req.body;
  const { userId } = req.body;
  const { add } = req.query;

  console.log(friendId, ";", userId);
  if (!friendId || !userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing userId or friendId" });
  }

  const MongoUserId = await findMongoDBUser(userId);
  const MongoFriendId = await findMongoDBUser(friendId);

  try {
    // cancel a sent request
    if (add === "false") {
      const cancelRequest = await prisma.friendship.delete({
        where: {
          receiverID_senderID: {
            senderID: MongoUserId?.id as string,
            receiverID: MongoFriendId?.id as string,
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
              senderID: MongoUserId?.id as string,
              receiverID: MongoFriendId?.id as string,
            },
            {
              senderID: MongoUserId?.id as string,
              receiverID: MongoFriendId?.id as string,
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
          senderID: MongoUserId?.id as string,
          receiverID: MongoFriendId?.id as string,
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
  const { friendId, userId } = req.body;
  const { accept } = req.query;

  if (!friendId || !userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing userId or friendId" });
  }

  const MongoUserId = await findMongoDBUser(userId);
  const MongoFriendId = await findMongoDBUser(friendId);
  try {
    if (accept === "true") {
      const friend = await prisma.friendship.update({
        where: {
          receiverID_senderID: {
            senderID: MongoFriendId?.id as string,
            receiverID: MongoUserId?.id as string,
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
            senderID: MongoFriendId?.id as string,
            receiverID: MongoUserId?.id as string,
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
    console.log("user: ", userId);
    if (!userId) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing userId" });
    }

    const MongoUserId = await findMongoDBUser(userId);
    console.log("MongoUserId: ", MongoUserId);
    const friends = await prisma.friendship.findMany({
      where: {
        // get all friends that have accepted the friend request
        OR: [
          {
            senderID: MongoUserId?.id as string,
            friendStatus: status as Status,
            receiverID: {
              not: MongoUserId?.id as string
            }
          },
          {
            receiverID: MongoUserId?.id as string,
            friendStatus: status as Status,
            senderID: {
              not: MongoUserId?.id as string
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
  const { userId } = req.query;

  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing userId" });
  }

  const MongoUserId = await findMongoDBUser(userId as string);
  try {
    const sentRequests = await prisma.friendship.findMany({
      where: {
        senderID: MongoUserId?.id as string,
        friendStatus: 'PENDING',
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
router.get("/friend/pending-requests", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing userId" });
  }

  const MongoUserId = await findMongoDBUser(userId as string);
  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverID: MongoUserId?.id as string,
        friendStatus: 'PENDING',
      },
      include: {
        sender: true
      }
    });
    res.status(StatusCodes.OK).json(pendingRequests);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting pending friend requests." });
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
