import { z, ZodType } from "zod";

type FormData = {
  name: string;
  startDate: string;
  endDate: string;
  location: {
    address: string;
    citystate: string;
    latitude: number;
    longitude: number;
    radius: number;
  };
};

export const TripSchema: ZodType<FormData> = z
  .object({
    name: z
      .string()
      .min(5, { message: "Name is too short" })
      .max(30, { message: "Name is too long" }),
    startDate: z.string().datetime({ message: "Invalid date format" }),
    endDate: z.string().datetime({ message: "Invalid date format" }),
    location: z.object({
      address: z.string().min(0, { message: "Address is too short" }).max(50),
      citystate: z.string().min(1).max(30),
      latitude: z.number(),
      longitude: z.number(),
      radius: z.number(),
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "datesReversed",
    path: ["endDate"],
  });
