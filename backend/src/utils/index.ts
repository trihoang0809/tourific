import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findMongoDBUser = async (firebaseUserId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        firebaseUserId: firebaseUserId,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to find user:", error);
    return null;
  }
};
