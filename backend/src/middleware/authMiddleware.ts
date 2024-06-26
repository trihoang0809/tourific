import { Request, Response, NextFunction } from "express";
import admin from "./firebaseAdmin";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("decode success: ", decodedToken);
    req.body.userId = decodedToken.uid; // Attach the userId to the request body
  } catch (err) {
    console.log("invalid right here: ", err);
    return res.status(401).send("Invalid Token");
  }
};
