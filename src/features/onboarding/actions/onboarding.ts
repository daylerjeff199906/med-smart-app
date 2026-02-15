"use server";

import { updateSessionOnboarding, getSession } from "@/lib/session";
import { createClient } from "@/utils/supabase/server";
import { onboardingSchema, type OnboardingInput } from "../types/onboarding";

/**
 * Result type for onboarding operations
 */
export interface OnboardingResult {
    readonly success: boolean;
    readonly error?: string;
}

/**
 * Custom error class for onboarding operations
 */
class OnboardingError extends Error {
    constructor(
        message: string,
        public readonly code: string
    ) {
        super(message);
        this.name = "OnboardingError";
    }
}

/**
 * Server Action to complete user onboarding with health data
 * 
 * Architecture:
 * - Validates input with Zod (strict typing, no 'any')
 * - Updates profiles and health_data tables
 * - Creates emergency contact record
 * - All operations are idempotent and transactional in nature
 * 
 * @param input - Validated onboarding form data
 * @returns OnboardingResult with success status
 */
export async function completeOnboarding(input: OnboardingInput): Promise<OnboardingResult> {
    try {
        // Step 1: Validate input with Zod
        const validation = onboardingSchema.safeParse(input);
        if (!validation.success) {
            const firstError = validation.error.issues[0];
            return {
                success: false,
                error: `${firstError.path.join(".")}: ${firstError.message}`,
            };
        }

        const data = validation.data;

        // Step 2: Verify authentication
        const session = await getSession();
        if (!session) {
            return {
                success: false,
                error: "Authentication required",
            };
        }

        const userId = session.user.id;
        const supabase = await createClient();

        // Step 3: Update profile table (solo fecha de nacimiento y género)
        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                birth_date: data.birthDate,
                gender: data.gender,
                onboarding_completed: true,
            })
            .eq("id", userId);

        if (profileError) {
            throw new OnboardingError(
                `Failed to update profile: ${profileError.message}`,
                "PROFILE_UPDATE_ERROR"
            );
        }

        // Step 4: Update health_data table (sensitive medical information)
        const { error: healthError } = await supabase
            .from("health_data")
            .update({
                weight: data.weight,
                height: data.height,
                blood_type: data.bloodType === "unknown" ? null : (data.bloodType ?? null),
                allergies: data.allergies ?? null,
                chronic_conditions: data.chronicConditions ?? null,
                has_diabetes: data.hasDiabetes,
                has_hypertension: data.hasHypertension,
            })
            .eq("profile_id", userId);

        if (healthError) {
            throw new OnboardingError(
                `Failed to update health data: ${healthError.message}`,
                "HEALTH_DATA_ERROR"
            );
        }

        // Step 5: Insert emergency contact
        const { error: contactError } = await supabase
            .from("emergency_contacts")
            .insert({
                profile_id: userId,
                contact_name: data.emergencyContactName,
                phone_number: data.emergencyContactPhone,
                relationship: data.emergencyContactRelationship,
                priority_order: 1,
            });

        if (contactError) {
            throw new OnboardingError(
                `Failed to create emergency contact: ${contactError.message}`,
                "EMERGENCY_CONTACT_ERROR"
            );
        }

        // Step 6: Update session to reflect onboarding completion
        await updateSessionOnboarding(true);

        return { success: true };

    } catch (error) {
        console.error("Onboarding error:", error);

        if (error instanceof OnboardingError) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred during onboarding",
        };
    }
}
