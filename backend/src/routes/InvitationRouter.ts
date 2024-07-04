import express, { Request } from "express";
import { PrismaClient, Status } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { TripParams } from "./TripRouter";
import { findMongoDBUser } from "src/utils";

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

export interface InvitationParams extends TripParams {
  invitationId: string,
  code?: string;
  status?: string;
}

// temporary for testing until auth done
// const userID = "6669267e34f4cab1d9ddd751";

// get an invitation by status
// example endpoint: /invite?status=PENDING
router.get("/", async (req: Request<InvitationParams>, res) => {
  const { status } = req.query;
  const { userId } = req.body;

  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "User ID is required." });
  }

  const MongoUserId = await findMongoDBUser(userId);
  try {
    const invitations = await prisma.tripMember.findMany({
      where: {
        inviteeId: MongoUserId?.id as string,
        status: status as Status
      },
    });

    res.status(StatusCodes.OK).json(invitations);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// get all received invitations of a user, including trip details
router.get("/all-received", async (req: Request, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "User ID is required." });
  }

  const MongoUserId = await findMongoDBUser(userId);
  try {
    const invitations = await prisma.tripMember.findMany({
      where: {
        inviteeId: MongoUserId?.id as string,
        status: 'PENDING'
      },
      include: {
        trip: true,
        inviter: true
      }
    });

    console.log("invitations", invitations);
    res.status(StatusCodes.OK).json(invitations);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitatiion." });
  }
});

// get all sent invitations of a user, including trip details
router.get("/all-sent", async (req: Request, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "User ID is required." });
  }

  const MongoUserId = await findMongoDBUser(userId);
  try {
    const invitations = await prisma.tripMember.findMany({
      where: {
        inviterId: MongoUserId?.id as string,
      },
      include: {
        trip: true,
        invitee: true,
      }
    });

    if (!invitations) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "No invitations found." });
    }

    res.status(StatusCodes.OK).json(invitations);
  } catch (error) {
    console.error("Error retrieving sent invitations:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while getting invitation." });
  }
});


// invite users, accept list of users' id
router.post("/:tripId", async (req: Request<InvitationParams>, res) => {
  const { tripId } = req.params;
  const inviteeIds = req.body.inviteeIds;
  const { inviterId } = req.body;

  
  try {
    console.log("inviteeIds", inviteeIds);
    if (!inviteeIds || inviteeIds.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'No invitee IDs provided' });
    }
    
    // Validate all provided user IDs exist
    const trans = await prisma.$transaction(async (tx) => {
      const MongoInviteeIds = inviteeIds.map(async (id: string) => await findMongoDBUser(id));

      const validUsers = await tx.user.findMany({
        where: { id: { in: MongoInviteeIds } },
        select: { id: true }
      });

      if (validUsers.length === 0) {
        return { newInviteeIds: [], invalidUserIds: MongoInviteeIds, invitations: [] };
      }

      const validUserIds = validUsers.map(user => user.id);
      console.log("validUserIds", validUserIds);

      const invalidUserIds = MongoInviteeIds.filter((id: string) => !validUserIds.includes(id));

      console.log("invalid", invalidUserIds);
      // Check for existing invitations
      const existingInvitations = await tx.tripMember.findMany({
        where: {
          tripId: tripId,
          inviteeId: { in: validUserIds },
          status: { not: 'REJECTED' }
        },
        select: { inviteeId: true }
      });

      console.log("existingInvitations", existingInvitations);
      const alreadyInvitedIds = existingInvitations.map(invitation => invitation.inviteeId);
      const newInviteeIds = validUserIds.filter(id => !alreadyInvitedIds.includes(id));
      console.log("newInviteeIds", newInviteeIds);
      console.log("alreadyInvitedIds", alreadyInvitedIds);

      if (newInviteeIds.length === 0) {
        return { newInviteeIds, invalidUserIds, invitations: [] };
      }

      // Create an invitation for each user
      const invitations = await tx.tripMember.createMany({
        data: newInviteeIds.map((inviteeId: string) => ({
          tripId: tripId,
          inviteeId: inviteeId,
          inviterId: inviterId,
          status: 'PENDING'
        })),
      });

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
// endpoint: /trips/tripId?status=ACCEPTED or /trips/tripId?status=REJECTED
router.patch("/:invitationId", async (req: Request<InvitationParams>, res) => {
  const { invitationId } = req.params;
  const { status } = req.query;
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const invitation = await prisma.tripMember.findUnique({
        where: { id: invitationId },
        select: { status: true }
      });

      if (!invitation || invitation.status !== 'PENDING') {
        throw new Error("Invitation cannot be accepted/rejected");
      }

      return await prisma.tripMember.update({
        where: { id: invitationId },
        data: { status: status as Status },
      });
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Failed to accept trip invitation:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal server error");
  }
});

//delete an invitation
router.delete("/:invitationId", async (req: Request<InvitationParams>, res) => {
  const { invitationId } = req.params;
  try {
    const result = await prisma.tripMember.delete({
      where: { id: invitationId }
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Failed to delete trip invitation:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal server error");
  }
});

export default router;
