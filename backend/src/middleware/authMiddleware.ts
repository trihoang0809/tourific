import { Request, Response, NextFunction } from "express";
import admin from "./firebaseAdmin"; // Ensure this imports correctly
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("decode success: ", decodedToken);

    const user = await prisma.user.findUnique({
      where: {
        firebaseUserId: decodedToken.uid,
      },
    });


    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user; // Attach the user to the request
    next();
  } catch (err) {
    console.log("invalid right here: ", err);
    return res.status(401).send("Invalid Token");
  }
};
