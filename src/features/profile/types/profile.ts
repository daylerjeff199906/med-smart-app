import { z } from "zod";

export const profileSchema = z.object({
    firstName: z.string().min(2, "First name is too short").max(100),
    lastName: z.string().min(2, "Last name is too short").max(100),
    email: z.string().email("Invalid email"),
    birthDate: z.string().optional(),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
