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
const userID = "663965ad325de4616021409b";

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


// invite users, accept list of users' id
router.post("/:tripId", async (req: Request<InvitationParams>, res) => {
  const { tripId } = req.params;
  const inviteeIds = req.body.inviteeIds; // array of user ids
  const inviterId = userID;

  try {
    // Validate all provided user IDs exist
    const trans = await prisma.$transaction(async (tx) => {
      const validUsers = await tx.user.findMany({
        where: { id: { in: inviteeIds } },
        select: { id: true }
      });

      const validUserIds = validUsers.map(user => user.id);
      const invalidUserIds = inviteeIds.filter((id: string) => !validUserIds.includes(id));

      console.log(validUserIds + "," + invalidUserIds);
      // Check for existing invitations
      const existingInvitations = await tx.tripMember.findMany({
        where: {
          tripId: tripId,
          inviteeId: { in: validUserIds }
        },
        select: { inviteeId: true }
      });

      console.log("existingInvitations", existingInvitations);
      const alreadyInvitedIds = existingInvitations.map(invitation => invitation.inviteeId);
      const newInviteeIds = validUserIds.filter(id => !alreadyInvitedIds.includes(id));
      console.log("newInviteeIds", newInviteeIds);
      console.log("alreadyInvitedIds", alreadyInvitedIds);

      // Create an invitation for each user
      const invitations = tx.tripMember.createMany({
        data: newInviteeIds.map((inviteeId: string) => ({
          tripId: tripId,
          inviteeId: inviteeId,
          inviterId: inviterId,
          status: 'PENDING'
        })),
      });
      // const invitations = validUserIds.map((inviteeId: string) => ({
      //   tripId: tripId,
      //   inviteeId: inviteeId,
      //   inviterId: inviterId,
      //   status: 'PENDING'
      // }));

      if (!invitations) {
        res.status(StatusCodes.NOT_ACCEPTABLE).json(invitations);
      }

      return { newInviteeIds, invalidUserIds, invitations };
    });

    res.status(StatusCodes.CREATED).json({
      message: 'Invitations processing completed.',
      sentToNewUsers: trans.newInviteeIds,
      alreadyInvitedUsers: trans.invitations,
      invalidUserIds: trans.invalidUserIds
    });
  } catch (error) {
    console.error('Failed to send invitations:', error);
    res.status(500).send('Internal Server Error');
  }
});

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
