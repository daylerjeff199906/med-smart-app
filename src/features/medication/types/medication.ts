import { z } from "zod";

export const MedicationFormEnum = z.enum([
    "tablet",
    "capsule",
    "liquid",
    "injection",
    "inhaler",
    "cream",
    "drops",
    "patch",
    "suppository",
    "other"
]);

export const DoseUnitEnum = z.enum([
    "mg",
    "ml",
    "mcg",
    "g",
    "tablet(s)",
    "capsule(s)",
    "drop(s)",
    "puff(s)",
    "unit(s)"
]);

export const MedicationFrequencyEnum = z.enum([
    "once_daily",
    "twice_daily",
    "three_times_daily",
    "four_times_daily",
    "every_x_hours",
    "as_needed",
    "weekly",
    "specific_days"
]);

export const MedicationStatusEnum = z.enum([
    "taken",
    "pending",
    "skipped",
    "missed",
    "postponed"
]);

export const MedicationTimeOfDayEnum = z.enum([
    "morning",
    "afternoon",
    "evening",
    "night",
    "with_meals",
    "fasting",
    "specific_time"
]);

export const medicationPlanSchema = z.object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    prescriptionId: z.string().optional().nullable(),
    name: z.string().min(1, "Medication name is required").max(255),
    form: MedicationFormEnum,
    doseAmount: z.number().positive("Dose must be positive"),
    doseUnit: DoseUnitEnum,
    frequency: MedicationFrequencyEnum,
    frequencyInterval: z.number().optional(),
    frequencyDays: z.array(z.number().min(0).max(6)).optional(),
    timesOfDay: z.array(MedicationTimeOfDayEnum).optional(),
    specificTimes: z.array(z.string()).optional(),
    instructions: z.string().max(1000).optional(),
    currentStock: z.number().int().min(0).default(0),
    lowStockThreshold: z.number().int().min(0).default(10),
    expirationDate: z.string().optional().nullable(),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    notifyViaEmail: z.boolean().default(false),
    syncToCalendar: z.boolean().default(false),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type MedicationPlanInput = z.infer<typeof medicationPlanSchema>;
export type MedicationForm = z.infer<typeof MedicationFormEnum>;
export type DoseUnit = z.infer<typeof DoseUnitEnum>;
export type MedicationFrequency = z.infer<typeof MedicationFrequencyEnum>;
export type MedicationStatus = z.infer<typeof MedicationStatusEnum>;
export type MedicationTimeOfDay = z.infer<typeof MedicationTimeOfDayEnum>;

export const medicationLogSchema = z.object({
    id: z.string().optional(),
    planId: z.string().min(1, "Plan ID is required"),
    userId: z.string().min(1, "User ID is required"),
    scheduledDate: z.string(),
    scheduledTime: z.string().optional(),
    actualTakenTime: z.string().optional().nullable(),
    status: MedicationStatusEnum,
    notes: z.string().max(500).optional(),
    doseTaken: z.number().optional(),
    doseTakenUnit: DoseUnitEnum.optional(),
    missedReason: z.string().max(500).optional(),
    createdAt: z.string().optional(),
});

export type MedicationLogInput = z.infer<typeof medicationLogSchema>;

export const medicationListSchema = z.object({
    medications: z.array(medicationPlanSchema)
});

export type MedicationListInput = z.infer<typeof medicationListSchema>;

export const medicationLogsListSchema = z.object({
    logs: z.array(medicationLogSchema)
});

export type MedicationLogsListInput = z.infer<typeof medicationLogsListSchema>;
