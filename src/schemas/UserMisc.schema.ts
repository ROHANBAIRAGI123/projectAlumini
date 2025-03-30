import { z } from "zod";

export const userMiscSchema = z.object({
  branch: z.string().optional(),
  achievement: z
    .string()
    .min(10, {
      message: "Achievements must be at least 10 characters long",
    })
    .optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  hideContact: z.boolean().optional(),
  refreshToken: z.string().optional(),
});
