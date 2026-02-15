import { z } from "zod";

export const BloodTypeEnum = z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"]);
export const GenderEnum = z.enum(["male", "female", "other", "prefer_not_to_say"]);

// Profile Schema
export const profileSchema = z.object({
    firstName: z.string().min(2, "First name is too short").max(100),
    lastName: z.string().min(2, "Last name is too short").max(100),
    email: z.string().email("Invalid email"),
    birthDate: z.string().optional(),
    gender: GenderEnum.optional(),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// Health Data Schema
export const healthDataSchema = z.object({
    weight: z.string().optional(),
    height: z.string().optional(),
    bloodType: BloodTypeEnum.optional(),
    allergies: z.string().max(1000).optional(),
    chronicConditions: z.string().max(1000).optional(),
    hasDiabetes: z.boolean(),
    hasHypertension: z.boolean(),
});

export type HealthDataInput = z.infer<typeof healthDataSchema>;

// Emergency Contact Schema
export const emergencyContactSchema = z.object({
    id: z.string().optional(),
    contactName: z.string().min(2, "Name is too short").max(255),
    phoneNumber: z.string().min(5, "Invalid phone number").max(50),
    relationship: z.string().min(2, "Relationship is required").max(100),
    priorityOrder: z.number(),
});

export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;

export const emergencyContactsListSchema = z.object({
    contacts: z.array(emergencyContactSchema)
});

export type EmergencyContactsListInput = z.infer<typeof emergencyContactsListSchema>;
