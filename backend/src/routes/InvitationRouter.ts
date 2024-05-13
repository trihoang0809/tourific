import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { createHash } from "crypto";
import { TripParams } from "./TripRouter";

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

export interface InvitationParams extends TripParams {
  invitationId: string,
  code: string;
}

// temporary for testing until auth done
const userID = "664038e4c21dfa644ef2a453";

// get all invitations of a user, including trip details
router.get("/", async (req: Request, res) => {
  try {
    const trips = await prisma.user.findMany({
      where: {
        id: userID
      },
      include: {
        inviterTripInvitations: true
      }
    });

    res.status(StatusCodes.OK).json(trips);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// get an invitation
router.get("/:code", async (req: Request<InvitationParams>, res) => {
  const { code } = req.params;
  try {
    const invitation = await prisma.tripInvitation.findUnique({
      where: {
        code: code,
      },
      include: {
        trip: true  // maybe we need to retrieve trip name for notifciation
      }
    });

    if (!invitation) {
      return res.status(StatusCodes.NOT_FOUND).send("Invitation not found");
    }

    res.status(StatusCodes.OK).json(invitation);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// DELETE an invitation

// CANCEL AN INVITATION
router.get("/:tripId", async (req: Request<InvitationParams>, res) => {
  const { tripId } = req.params;
  const inviteeIds = req.body.inviteeIds; // array of user ids
  const inviterId = userID;

  // delete trip invitation from invitation list in user model

});


// INVITE MULTIPLE USERS, ACCEPTING LIST OF USERS
// NO NEED TO CHECK IF USER ALREADY JOINED TRIP BCOZ
// WHEN FETCHING USER TO CHOOSE TO ADD TO TRIP, WE WILL 
// CHECL THAT
// route: invitation/tripid
router.post("/:tripId", async (req: Request<InvitationParams>, res) => {
  const { tripId } = req.params;
  const inviteeIds = req.body.inviteeIds; // array of user ids
  const inviterId = userID;

  try {
    // Validate all provided user IDs exist
    const validUsers = await prisma.user.findMany({
      where: { id: { in: inviteeIds } },
      select: { id: true }
    });

    // check if exist an invitation
    const existInvitations = await Promise.all(
      validUsers.map(user => prisma.tripInvitation.findMany({
        where: {
          tripId: tripId,
          inviterId: userID,
          inviteeId: user.id
        },
        select: { id: true }
      }))
    );

    // validUserInvitations is a 2d array
    const invalidUserIds = existInvitations.flat().map(invitation => invitation.id);

    const validUserIds = inviteeIds.filter((id: string) => !invalidUserIds.includes(id));

    // Create an invitation for each user
    const invitations = validUserIds.map((inviteeId: string) => ({
      tripId: tripId,
      inviteeId: inviteeId,
      inviterId: inviterId,
      code: createHash('sha256').update(inviteeId + tripId + Date.now().toString()).digest('hex'), // generate a unique code
      status: 'PENDING'
    }));

    const createdInvitations = await Promise.all(
      invitations.map((invitation: any) =>
        prisma.tripInvitation.create({
          data: invitation
        })
      )
    );

    if (!createdInvitations) {
      res.status(StatusCodes.NOT_ACCEPTABLE).json(createdInvitations);
    }

    res.status(StatusCodes.CREATED).json({
      message: 'Invitations sent successfully to valid users.',
      invalidUserIds: invalidUserIds // inform the invalid user IDs
    });

  } catch (error) {
    console.error('Failed to send invitations:', error);
    res.status(500).send('Internal Server Error');
  }
});

// accept or decline invite to join group
// endpoint: /trips/tripId?accept=true
// endpoint: /trips/tripId?accept=false
router.put("/:tripId", async (req: Request<InvitationParams>, res) => {
  const inviteeId = userID;
  const { tripId } = req.params;
  const { accept } = req.query;

  try {
    // check user and trip id
    const [user, trip] = await Promise.all([
      prisma.user.findUnique({ where: { id: inviteeId } }),
      prisma.trip.findUnique({ where: { id: tripId } })
    ]);

    if (!user || !trip) {
      return res.status(StatusCodes.NOT_FOUND).send("Not found");
    }

    // check if already joined the group for case multiple users sending invitation
    const isJoined = await prisma.trip.findFirst({
      where: {
        participantsID: {
          has: inviteeId
        }
      }
    });

    if (isJoined) {
      res.sendStatus(StatusCodes.BAD_REQUEST).json({ error: "You already in the trip" });
    }

    // user accepts invitation
    if (accept === "true") {
      // Add user to trip participants
      await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          participantsID: {
            push: inviteeId // adds user ID to the participantsID array
          }
        }
      });

      // Add trip to user's trip list
      await prisma.user.update({
        where: {
          id: inviteeId,
        },
        data: {
          tripID: {
            push: tripId // adds the trip ID to the user's tripID array
          }
        }
      });

      const accepted = await prisma.tripInvitation.update({
        where: {
          tripId_inviteeId: {
            tripId: tripId,
            inviteeId: inviteeId
          }
        },
        data: {
          status: 'ACCEPTED'
        }
      });

      if (!accepted) {
        res.sendStatus(StatusCodes.BAD_REQUEST).send("Failed to accept");
      }
      res.sendStatus(StatusCodes.ACCEPTED).send("User added to trip successfully");
    } else {
      // UPDATE tripinvitation model
      const declined = await prisma.tripInvitation.update({
        where: {
          tripId_inviteeId: {
            tripId: tripId,
            inviteeId: inviteeId
          }
        },
        data: {
          status: 'INIT'
        }
      });

      // find tripid in user model
      const trips = await prisma.user.findUnique({
        where: {
          id: userID
        },
        select: {
          tripID: true
        }
      });

      // update user model, delete tripid from tripinvitation array
      await prisma.user.update({
        where: {
          id: inviteeId,
        },
        data: {
          tripID: {
            set: trips?.tripID.filter((id) => id !== tripId)
          }
        }
      });
      res.send("Invitation not accepted");
    }
  } catch (error) {
    console.error("Failed to accept trip invitation:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal server error");
  }
});

export default router;