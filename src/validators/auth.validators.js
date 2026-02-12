import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    userName: z.string().min(2, "Name too short").max(80),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password min 6 chars"),
    role: z.enum(["admin", "customer"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password min 6 chars"),
  }),
});
