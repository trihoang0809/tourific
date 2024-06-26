import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Ensure public key is read correctly
const publicKey = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, "\n");

if (!publicKey) {
  throw new Error("JWT_PUBLIC_KEY is not set in the environment variables");
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    console.log("public key: ", publicKey);
    const decoded: any = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    console.log("decode success: ", decoded);
    req.body.userId = decoded.user_id || decoded.sub; // Attach the userId to the request body
  } catch (err) {
    console.log("invalid right here: ", err);
    return res.status(401).send("Invalid Token");
  }
};
