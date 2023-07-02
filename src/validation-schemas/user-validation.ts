import { z } from "zod";
export const updateUserSchema = z.object({
  username: z.string(),
  avatar: z.nullable(z.optional(z.string())),
  gallery: z.nullable(z.optional(z.array(z.string()))),
  description: z.nullable(z.optional(z.string())),
  interests: z.nullable(z.optional(z.array(z.number())))
})