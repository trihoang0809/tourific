import { z } from "zod";

export const tripCreateSchema = z.object({
  name: z.string().trim().min(5, { message: "Name is too short" }).max(30, { message: "Name is too long" }),
  startDate: z.string().datetime({
    message: "Please select a date and time",
    offset: true,
  }),
  endDate: z.string().datetime({
    message: "Please select a date and time",
    offset: true,
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
    }, "Please choose a destination"),
  image: z.object({
    height: z.number().optional(),
    width: z.number().optional(),
    url: z.string().url({ message: "Please use a URL" }).min(5),
  }),
  firebaseUserId: z.string().nonempty("User ID is required"),
  participantsID: z.array(z.string()).optional(),
});
