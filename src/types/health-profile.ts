import type { Profile, HealthData, EmergencyContact } from "@/types/supabase";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface UserProfile {
    readonly id: string;
    readonly fullName: string | null;
    readonly avatarUrl: string | null;
    readonly birthDate: string | null;  // ISO date: YYYY-MM-DD
    readonly gender: Gender | null;
    readonly onboardingCompleted: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface UserHealthData {
    readonly profileId: string;
    readonly weight: number | null;     // kg
    readonly height: number | null;     // cm
    readonly bloodType: BloodType | null;
    readonly allergies: string | null;
    readonly chronicConditions: string | null;
    readonly hasDiabetes: boolean;
    readonly hasHypertension: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface UserEmergencyContact {
    readonly id: string;
    readonly profileId: string;
    readonly contactName: string;
    readonly phoneNumber: string;
    readonly relationship: string;
    readonly priorityOrder: number;     // 1 = primary, 2 = secondary, etc.
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface UserHealthProfile {
    readonly profile: UserProfile;
    readonly healthData: UserHealthData;
    readonly emergencyContacts: readonly UserEmergencyContact[];
}

export interface UserHealthProfileSummary {
    readonly id: string;
    readonly fullName: string | null;
    readonly avatarUrl: string | null;
    readonly age: number | null;        // Calculated from birthDate
    readonly gender: Gender | null;
    readonly hasDiabetes: boolean;
    readonly hasHypertension: boolean;
    readonly bloodType: BloodType | null;
}

export type CreateUserProfileInput = Omit<UserProfile, "id" | "createdAt" | "updatedAt">;
export type CreateHealthDataInput = Omit<UserHealthData, "profileId" | "createdAt" | "updatedAt">;
export type CreateEmergencyContactInput = Omit<UserEmergencyContact, "id" | "profileId" | "createdAt" | "updatedAt">;

export type UpdateUserProfileInput = Partial<CreateUserProfileInput>;
export type UpdateHealthDataInput = Partial<CreateHealthDataInput>;
export type UpdateEmergencyContactInput = Partial<CreateEmergencyContactInput>;

export function isGender(value: unknown): value is Gender {
    return typeof value === "string" &&
        ["male", "female", "other", "prefer_not_to_say"].includes(value);
}


export function isBloodType(value: unknown): value is BloodType {
    return typeof value === "string" &&
        ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(value);
}

export function mapToUserProfile(row: Profile): UserProfile {
    return {
        id: row.id,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        birthDate: row.birth_date,
        gender: row.gender,
        onboardingCompleted: row.onboarding_completed,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function mapToUserHealthData(row: HealthData): UserHealthData {
    return {
        profileId: row.profile_id,
        weight: row.weight,
        height: row.height,
        bloodType: row.blood_type,
        allergies: row.allergies,
        chronicConditions: row.chronic_conditions,
        hasDiabetes: row.has_diabetes,
        hasHypertension: row.has_hypertension,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/**
 * Maps database EmergencyContact row to UserEmergencyContact interface
 */
export function mapToUserEmergencyContact(row: EmergencyContact): UserEmergencyContact {
    return {
        id: row.id,
        profileId: row.profile_id,
        contactName: row.contact_name,
        phoneNumber: row.phone_number,
        relationship: row.relationship,
        priorityOrder: row.priority_order,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/**
 * Calculates age from birth date
 * Returns null if birthDate is invalid
 */
export function calculateAge(birthDate: string | null): number | null {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) return null;

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

/**
 * Creates a summary view from full profile data
 */
export function createProfileSummary(
    profile: UserProfile,
    healthData: UserHealthData
): UserHealthProfileSummary {
    return {
        id: profile.id,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        age: calculateAge(profile.birthDate),
        gender: profile.gender,
        hasDiabetes: healthData.hasDiabetes,
        hasHypertension: healthData.hasHypertension,
        bloodType: healthData.bloodType,
    };
}
