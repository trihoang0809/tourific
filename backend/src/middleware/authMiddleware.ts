import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import admin from "./firebaseAdmin";

const prisma = new PrismaClient();

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

    req.body.user = user; // Attach the userId to the request body
    next();
  } catch (err) {
    console.log("invalid right here: ", err);
    return res.status(401).send("Invalid Token");
  }
};
