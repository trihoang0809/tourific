// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from "http-status-codes";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("req.body", req.body);
      // console.log("type of data", req.body.startDate, typeof req.body.startDate);
      schema.safeParse(req.body);
      next();
    } catch (error) {
      console.log("Zod error", error);
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} : ${issue.message}`,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid data", details: errorMessages });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
      }
    }
  };
}
