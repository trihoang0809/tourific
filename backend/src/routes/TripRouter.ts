import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import ActivityRouter from "./ActivityRouter";
import { validateData } from "../middleware/validationMiddleware";
import { tripCreateSchema } from "../schemas/tripSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { StatusCodes } from "http-status-codes";
import InvitationRouter from "./InvitationRouter";

// const express = require('express')
const router = express.Router();
const prisma = new PrismaClient();
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL;
const PORT = process.env.PORT || 3000;


export interface TripParams {
  tripId: string;
  userId: string;
  code?: string;
}

// temporary for testing until auth done
const userID = "664023f929694f249f1a4c86";

// Activites of a trip
router.use("/:tripId/activities", ActivityRouter);

// Invitation route
router.use("/invitation", InvitationRouter);

// Get all trips of a user
router.get("/", async (req: Request<TripParams>, res) => {
  try {
    const userId = userID;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User does not exists!" });
    }

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
      // console.log(now);
    }

    const trips = await prisma.trip.findMany(queryConditions);
    res.json(trips);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching trips." });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = userID;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User does not exists!" });
    }

    const { name, startDate, endDate, location, image } = req.body;
    const trip = await prisma.trip.create({
      data: {
        name,
        startDate,
        endDate,
        location,
        image,
        participants: {
          connect: {
            id: userID
          }
        }
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
    });
    res.status(StatusCodes.OK).json(trip);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching a trip." });
  }
});

// Create a new trip
router.post("/", validateData(tripCreateSchema), async (req, res) => {
  try {
    const userId = userID;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User does not exists!" });
    }

    const { name, startDate, endDate, location, image } = req.body;
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
  try {
    const { id } = req.params;
    const { name, startDate, endDate, location, image } = req.body;
    const isValidID = await prisma.trip.findUnique({
      where: {
        id,
      },
    });

    if (!isValidID) {
      res.status(StatusCodes.NOT_FOUND);
    }

    const trip = await prisma.trip.update({
      where: {
        id,
      },
      data: {
        name,
        startDate,
        endDate,
        location,
        image
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
    const isValidID = await prisma.trip.findUnique({
      where: {
        id,
      },
    });

    if (!isValidID) {
      res.status(StatusCodes.NOT_FOUND);
    }

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

// DELETE PARTICIPANT OUT OF TRIPS

// // get an invitation
// // https://${LOCAL_HOST_URL}:${PORT}/trips/${invitationCode}
// router.get("/:code", async (req: Request<TripParams>, res) => {
//   const { code } = req.params;
//   try {
//     const invitation = await prisma.tripInvitation.findUnique({
//       where: {
//         code: code,
//       },
//       include: {
//         trip: true  // maybe we need to retrieve trip name for notifciation
//       }
//     });

//     if (!invitation) {
//       return res.status(StatusCodes.NOT_FOUND).send("Invitation not found");
//     }

//     res.status(StatusCodes.OK).json(invitation);
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
//   }
// });

// // invite a user to a group
// router.post("/:tripId/invite", async (req: Request<TripParams>, res) => {
//   const { userId } = req.body;
//   const { tripId } = req.params;

//   try {
//     //check user id and trip exists
//     const [user, trip] = await Promise.all([
//       prisma.user.findUnique({ where: { id: userId } }),
//       prisma.trip.findUnique({ where: { id: tripId } })
//     ]);

//     if (!user || !trip) {
//       return res.status(StatusCodes.NOT_FOUND).send("Not found");
//     }

//     // check if an invitation already exist
//     const existingInvitation = await prisma.tripInvitation.findUnique({
//       where: {
//         tripId_userId: {
//           tripId: tripId,
//           userId: userID
//         }
//       }
//     });

//     if (existingInvitation) {
//       if (existingInvitation.status === 'REJECTED') {
//         // update the existing invitation if it was declined
//         const updatedInvitation = await prisma.tripInvitation.update({
//           where: { id: existingInvitation.id },
//           data: { status: 'PENDING' }
//         });
//       } else {
//         return res.status(StatusCodes.CONFLICT).json(
//           {
//             message: "An invitation already exists for this user and trip."
//           });
//       }
//     }

//     //generate a unique code 
//     const invitationCode = createHash('sha256').update((userId + tripId)).digest('hex');
//     // const link = `https://${LOCAL_HOST_URL}:${PORT}/${invitationCode}`;

//     const invitation = await prisma.tripInvitation.create({
//       data: {
//         userId: userId,
//         tripId: tripId,
//         code: invitationCode,
//         status: 'PENDING'
//       }
//     });

//     //update trip invitation in user model
//     await prisma.user.update({
//       where: {
//         id: userId
//       },
//       data: {
//         tripInvitation: {
//           push: invitation.id
//         }
//       }
//     });

//     return res.status(StatusCodes.CREATED).json(invitation);
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while inviting." });
//   }
// });

// // accept or decline invite to join group
// // /users/tripId/invite?accept=true
// router.put("/:tripId/invite", async (req: Request<TripParams>, res) => {
//   const { userId } = req.body;
//   const { tripId } = req.params;
//   const { accept } = req.query;

//   try {
//     // check user and trip id
//     const [user, trip] = await Promise.all([
//       prisma.user.findUnique({ where: { id: userId } }),
//       prisma.trip.findUnique({ where: { id: tripId } })
//     ]);

//     if (!user || !trip) {
//       return res.status(StatusCodes.NOT_FOUND).send("Not found");
//     }

//     if (accept === "true") {
//       // Add user to trip participants
//       await prisma.trip.update({
//         where: {
//           id: tripId,
//         },
//         data: {
//           participantsID: {
//             push: userId // adds user ID to the participantsID array
//           }
//         }
//       });

//       // Add trip to user's trip list
//       await prisma.user.update({
//         where: {
//           id: userId,
//         },
//         data: {
//           tripID: {
//             push: tripId // adds the trip ID to the user's tripID array
//           }
//         }
//       });

//       const accepted = await prisma.tripInvitation.update({
//         where: {
//           tripId_userId: {
//             tripId: tripId,
//             userId: userId
//           }
//         },
//         data: {
//           status: 'ACCEPTED'
//         }
//       });

//       if (!accepted) {
//         res.sendStatus(StatusCodes.BAD_REQUEST).send("Failed to accept");
//       }
//       res.sendStatus(StatusCodes.ACCEPTED).send("User added to trip successfully");
//     } else {
//       // UPDATE tripinvitation model
//       const declined = await prisma.tripInvitation.update({
//         where: {
//           tripId_userId: {
//             tripId: tripId,
//             userId: userId
//           }
//         },
//         data: {
//           status: 'REJECTED'
//         }
//       });

//       // find tripid in user model
//       const trips = await prisma.user.findUnique({
//         where: {
//           id: userID
//         },
//         select: {
//           tripID: true
//         }
//       });

//       // update user model, delete tripid from tripinvitation array
//       await prisma.user.update({
//         where: {
//           id: userId,
//         },
//         data: {
//           tripID: {
//             set: trips?.tripID.filter((id) => id !== tripId)
//           }
//         }
//       });
//       res.send("Invitation not accepted");
//     }
//   } catch (error) {
//     console.error("Failed to accept trip invitation:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal server error");
//   }
// });

export default router;
