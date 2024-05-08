import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connect = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
};
