import { z } from "zod";

export const cookieSchema = z.object({
  access_token: z.string()
})

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
})

export const signupSchema = z.object({
  username: z.string().max(20),
  password: z.string()
})