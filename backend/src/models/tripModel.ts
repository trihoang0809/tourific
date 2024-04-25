import { PrismaClient, Prisma } from '@prisma/client'
import { z } from 'zod'

export const TripCreateInput = z.object({
  name: z.string().trim().min(5).max(30),
  dateRange: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
  location: z.object({
    address: z.string(),
    citystate: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    radius: z.number(),
  }),
}) satisfies z.Schema<Prisma.TripUncheckedCreateInput>

/**
 * Prisma Client Extension
 */
const prisma = new PrismaClient().$extends({
  query: {
    trip: {
      create({ args, query }) {
        const parsed = TripCreateInput.safeParse(args.data);
        if (!parsed.success) {
          // Handle the validation error here
          throw new Error(parsed.error.message);
        }
        args.data = TripCreateInput.parse(args.data)
        return query(args)
      },
      // update({ args, query }) {
      //   args.data = TripCreateInput.partial().parse(args.data)
      //   return query(args)
      // },
      // updateMany({ args, query }) {
      //   args.data = TripCreateInput.partial().parse(args.data)
      //   return query(args)
      // },
      // upsert({ args, query }) {
      //   args.create = TripCreateInput.parse(args.create)
      //   args.update = TripCreateInput.partial().parse(args.update)
      //   return query(args)
      // },
    },
  },
})