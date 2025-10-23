import { email, z } from "zod";

export const updateUserSchema = z.object({
  email: z.email().optional(),
  fullName: z.string().optional(),
});
