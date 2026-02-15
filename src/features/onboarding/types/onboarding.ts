import { z } from "zod";

/**
 * Blood type enum matching database enum
 */
export const BloodTypeEnum = z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
export type BloodType = z.infer<typeof BloodTypeEnum>;

/**
 * Gender enum matching database enum
 */
export const GenderEnum = z.enum(["male", "female", "other", "prefer_not_to_say"]);
export type Gender = z.infer<typeof GenderEnum>;

/**
 * Zod schema for validating onboarding form data
 * Strictly typed - no 'any' types allowed
 */
export const onboardingSchema = z.object({
    // Identity Information
    firstName: z.string().min(2, "First name is too short").max(100, "First name is too long"),
    lastName: z.string().min(2, "Last name is too short").max(100, "Last name is too long"),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    gender: GenderEnum,

    // Biometric Data
    weight: z.coerce.number().min(1, "Invalid weight").max(999.99, "Weight too high"),
    height: z.coerce.number().min(1, "Invalid height").max(999.99, "Height too high"),

    // Medical Information
    bloodType: BloodTypeEnum.optional(),
    allergies: z.string().max(1000, "Allergies description too long").optional(),
    chronicConditions: z.string().max(1000, "Conditions description too long").optional(),
    hasDiabetes: z.boolean().default(false),
    hasHypertension: z.boolean().default(false),

    // Emergency Contact
    emergencyContactName: z.string().min(2, "Contact name is too short").max(255, "Name is too long"),
    emergencyContactPhone: z.string().min(5, "Invalid phone number").max(50, "Phone number too long"),
    emergencyContactRelationship: z.string().min(2, "Relationship is required").max(100, "Relationship description too long"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
