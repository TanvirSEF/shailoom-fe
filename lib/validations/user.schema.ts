import { z } from "zod";

export const profileUpdateSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
});

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
