import { PrismaClient, Prisma } from "@prisma/client";
import e from "express";
import { z } from "zod";

export const tripCreateSchema = z.object({
  name: z.string().trim().min(5, { message: "Name is too short" }).max(30, { message: "Name is too long" }),
  startDate: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  endDate: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .refine((data) => {
      return data >= new Date(Date.now());
    }, "The end date must be in the future"),
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
    }, "Please choose a destination"),
});
// satisfies z.Schema<Prisma.TripUncheckedCreateInput>

/**
 * Prisma Client Extension
 */
// const prisma = new PrismaClient().$extends({
//   query: {
//     trip: {
//       create({ args, query }) {
//         const parsed = tripCreateSchema.safeParse(args.data);
//         if (!parsed.success) {
//           // Handle the validation error here
//           throw new Error(parsed.error.message);
//         }
//         args.data = tripCreateSchema.parse(args.data)
//         return query(args)
//       },
//       // update({ args, query }) {
//       //   args.data = TripCreateInput.partial().parse(args.data)
//       //   return query(args)
//       // },
//       // updateMany({ args, query }) {
//       //   args.data = TripCreateInput.partial().parse(args.data)
//       //   return query(args)
//       // },
//       // upsert({ args, query }) {
//       //   args.create = TripCreateInput.parse(args.create)
//       //   args.update = TripCreateInput.partial().parse(args.update)
//       //   return query(args)
//       // },
//     },
//   },
// })
