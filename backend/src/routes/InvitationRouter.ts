import express, { Request } from "express";
import { PrismaClient, Status } from "@prisma/client";
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
const userID = "664023f929694f249f1a4c86";

// get all received invitations of a user, including trip details
router.get("/all-received", async (req: Request, res) => {
  try {
    const trips = await prisma.tripMember.findMany({
      where: {
        inviteeId: userID,
      },
      include: {
        trip: true,
        inviter: true
      }
    });

    console.log("trips", trips);
    res.status(StatusCodes.OK).json(trips);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// get all sent invitations of a user, including trip details
router.get("/all-sent", async (req: Request, res) => {
  try {
    const trips = await prisma.tripMember.findMany({
      where: {
        inviterId: userID,
      },
      include: {
        trip: true,
        invitee: true
      }
    });

    res.status(StatusCodes.OK).json(trips);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// get an invitation by status
// example endpoint: /invite?status=PENDING
router.get("/", async (req: Request<InvitationParams>, res) => {
  const { status } = req.query;
  try {
    const trips = await prisma.tripMember.findMany({
      where: {
        inviteeId: userID,
        status: status as Status
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
router.patch("/:invitationId/accept", async (req: Request<InvitationParams>, res) => {
  const { invitationId } = req.params;
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const invitation = await prisma.tripMember.findUnique({
        where: { id: invitationId },
        select: { status: true }
      });

      if (!invitation || invitation.status !== 'PENDING') {
        throw new Error("Invitation cannot be accepted");
      }

      return await prisma.tripMember.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED' },
      });
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Failed to accept trip invitation:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal server error");
  }
});


// accept or decline invite to join group
// endpoint: /trips/tripId/decline
router.patch("/:invitationId/decline", async (req: Request<InvitationParams>, res) => {
  const { invitationId } = req.params;
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const invitation = await prisma.tripMember.findUnique({
        where: { id: invitationId },
        select: { status: true }
      });

      if (!invitation || invitation.status !== 'PENDING') {
        throw new Error("Invitation cannot be declined");
      }

      return await prisma.tripMember.update({
        where: { id: invitationId },
        data: { status: 'REJECTED' },
      });
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Failed to accept trip invitation:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal server error");
  }
});

export default router;