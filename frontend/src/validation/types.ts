import { TripData } from "@/types";
import { z, ZodType } from "zod";

export type FormData = {
  name: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
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
    dateRange: z.object({
      startDate: z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      }),
      endDate: z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
       }),
    }),
    location: z.object({
      address: z.string().min(0, { message: "Address is too short" }).max(100),
      citystate: z.string().min(1).max(100),
      latitude: z.number(),
      longitude: z.number(),
      radius: z.number(),
    }),
  })
  // .refine((data) => data.dateRange.endDate > data.dateRange.startDate, {
  //   message: "datesReversed",
  //   path: ["endDate"],
  // });
