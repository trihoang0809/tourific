// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (parsed.success) {
      req.body = parsed.data;
      next();
    } else {
      console.log("Zod error", parsed.error);
      if (parsed.error instanceof z.ZodError) {
        const errorMessages = parsed.error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} : ${issue.message}`,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid data", details: errorMessages });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
      }
    }
  };
}