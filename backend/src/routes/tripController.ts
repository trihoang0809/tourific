import { Request, Response } from "express";

export const createTrip = (req: Request, res: Response) => {
  // Handle trip creation  logic using validated data from req.body
  res.json({ message: "Trip created successfully", data: req.body });
};
