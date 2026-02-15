import { z } from "zod";

export const BloodTypeEnum = z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
export type BloodType = z.infer<typeof BloodTypeEnum>;

export const GenderEnum = z.enum(["male", "female", "other", "prefer_not_to_say"]);
export type Gender = z.infer<typeof GenderEnum>;

export const onboardingSchema = z.object({
    // Identity Information (nombres ya existen en el perfil)
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    gender: GenderEnum,

    // Biometric Data
    weight: z.number().min(1, "Invalid weight").max(999.99, "Weight too high").optional(),
    height: z.number().min(1, "Invalid height").max(999.99, "Height too high").optional(),

    // Medical Information
    bloodType: BloodTypeEnum.optional(),
    allergies: z.string().max(1000, "Allergies description too long").optional(),
    chronicConditions: z.string().max(1000, "Conditions description too long").optional(),
    hasDiabetes: z.boolean().optional(),
    hasHypertension: z.boolean().optional(),

    // Emergency Contact
    emergencyContactName: z.string().min(2, "Contact name is too short").max(255, "Name is too long"),
    emergencyContactPhone: z.string().min(5, "Invalid phone number").max(50, "Phone number too long"),
    emergencyContactRelationship: z.string().min(2, "Relationship is required").max(100, "Relationship description too long"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
