import { timeRange } from "@/types";
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

export const TripSchema: ZodType<FormData> = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "Name is too short" })
    .max(30, { message: "Name is too long" }),
  dateRange: z
    .object({
      startDate: z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      }),
      endDate: z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      }),
    })
    .refine((date) => {
      return (
        date.startDate >= new Date(Date.now()) ||
        date.endDate >= new Date(Date.now())
      );
    }, "The date must not be in the past"),
  startTime: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
  endTime: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
  location: z
    .object({
      address: z.string(),
      citystate: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      radius: z.number(),
    })
    .refine((data) => {
      return data.address || data.citystate;
    }, "* Please choose a destination"),
});

export const TimeRangeSchema: ZodType<timeRange> = z.object({
  startTime: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
  endTime: z.object({
    hours: z.number(),
    minutes: z.number(),
  }),
});
