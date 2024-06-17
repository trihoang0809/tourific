import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  if (!process.env.TOKEN_KEY) {
    return res.status(500).send("TOKEN_KEY is not set in the environment variables");
  }

  try {
    const decoded: any = jwt.verify(token, process.env.TOKEN_KEY as string);
    req.body.userId = decoded.userId; // Attach the userId to the request body
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
