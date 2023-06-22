import { z } from "zod";

export const getUserSchema = z.object({
  id: z.number()
})

export const likeUserSchema = z.object({
  id: z.number()
})