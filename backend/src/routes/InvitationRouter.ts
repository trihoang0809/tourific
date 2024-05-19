import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { createHash } from "crypto";
import { TripParams } from "./TripRouter";

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

export interface InvitationParams extends TripParams {
  invitationId: string,
  code?: string;
  status?: string;
}

// temporary for testing until auth done
const userID = "664038e4c21dfa644ef2a453";

// get all received invitations of a user, including trip details
router.get("/", async (req: Request, res) => {
  try {
    const trips = await prisma.tripMember.findMany({
      where: {
        inviteeId: userID,
      },
      include: {
        trip: true
      }
    });

    res.status(StatusCodes.OK).json(trips);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// get all sent invitations of a user, including trip details
router.get("/", async (req: Request, res) => {
  try {
    const trips = await prisma.tripMember.findMany({
      where: {
        inviterId: userID,
      },
      include: {
        trip: true
      }
    });

    res.status(StatusCodes.OK).json(trips);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// get an invitation by status
router.get("/", async (req: Request<InvitationParams>, res) => {
  const { status } = req.body;
  try {
    const trips = await prisma.tripMember.findMany({
      where: {
        inviteeId: userID,
        status: status
      },
    });

    res.status(StatusCodes.OK).json(trips);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// DELETE/CANCEL an invitation
// Cannot delete an invitation, but we can kick members 
// out of the trip


// // INVITE MULTIPLE USERS, ACCEPTING LIST OF USERS
// // NO NEED TO CHECK IF USER ALREADY JOINED TRIP BCOZ
// // WHEN FETCHING USER TO CHOOSE TO ADD TO TRIP, WE WILL
// // CHECL THAT
// // route: invitation/tripid
// router.post("/:tripId", async (req: Request<InvitationParams>, res) => {
//   const { tripId } = req.params;
//   const inviteeIds = req.body.inviteeIds; // array of user ids
//   const inviterId = userID;

//   try {
//     // Validate all provided user IDs exist
//     const validUsers = await prisma.user.findMany({
//       where: { id: { in: inviteeIds } },
//       select: { id: true }
//     });

//     // check if exist an invitation
//     const existInvitations = await Promise.all(
//       validUsers.map(user => prisma.tripInvitation.findMany({
//         where: {
//           tripId: tripId,
//           inviterId: userID,
//           inviteeId: user.id
//         },
//         select: { id: true }
//       }))
//     );

//     // validUserInvitations is a 2d array
//     const invalidUserIds = existInvitations.flat().map(invitation => invitation.id);

//     const validUserIds = inviteeIds.filter((id: string) => !invalidUserIds.includes(id));

//     // Create an invitation for each user
//     const invitations = validUserIds.map((inviteeId: string) => ({
//       tripId: tripId,
//       inviteeId: inviteeId,
//       inviterId: inviterId,
//       code: createHash('sha256').update(inviteeId + tripId + Date.now().toString()).digest('hex'), // generate a unique code
//       status: 'PENDING'
//     }));

//     const createdInvitations = await Promise.all(
//       invitations.map((invitation: any) =>
//         prisma.tripInvitation.create({
//           data: invitation
//         })
//       )
//     );

//     if (!createdInvitations) {
//       res.status(StatusCodes.NOT_ACCEPTABLE).json(createdInvitations);
//     }

//     res.status(StatusCodes.CREATED).json({
//       message: 'Invitations sent successfully to valid users.',
//       invalidUserIds: invalidUserIds // inform the invalid user IDs
//     });

//   } catch (error) {
//     console.error('Failed to send invitations:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// accept or decline invite to join group
// endpoint: /trips/tripId/accept
router.patch("/:tripId/accept", async (req: Request<InvitationParams>, res) => {
  const inviteeId = userID;
  const { tripId, accept } = req.params;

  try {
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

  } catch (error) {
    console.error("Failed to accept trip invitation:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal server error");
  }
});


router.patch("/:tripId/decline", async (req: Request<InvitationParams>, res) => {
  // UPDATE tripinvitation model

});

export default router;