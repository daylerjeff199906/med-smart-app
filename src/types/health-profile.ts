

/**
 * Bequi SuperApp - Type Definitions
 * 
 * Based on user's database structure
 */

// =============================================================================
// ENUMS
// =============================================================================

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

// =============================================================================
// DOMAIN ENTITIES
// =============================================================================

/**
 * User profile information
 * Maps to: profiles table
 */
export interface UserProfile {
    readonly id: string;
    readonly email: string;
    readonly firstName: string | null;
    readonly lastName: string | null;
    readonly avatarUrl: string | null;
    readonly birthDate: string | null;
    readonly gender: Gender | null;
    readonly onboardingCompleted: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
}

/**
 * Health data entity (sensitive PHI)
 * Maps to: health_data table
 */
export interface UserHealthData {
    readonly profileId: string;
    readonly weight: number | null;
    readonly height: number | null;
    readonly bloodType: BloodType | null;
    readonly allergies: string | null;
    readonly chronicConditions: string | null;
    readonly hasDiabetes: boolean;
    readonly hasHypertension: boolean;
}

/**
 * Emergency contact entity
 * Maps to: emergency_contacts table
 */
export interface UserEmergencyContact {
    readonly id: string;
    readonly profileId: string;
    readonly contactName: string;
    readonly phoneNumber: string;
    readonly relationship: string;
    readonly priorityOrder: number;
}

// =============================================================================
// INPUT & UPDATE TYPES
// =============================================================================

export type CreateUserProfileInput = Omit<UserProfile, "id" | "createdAt" | "updatedAt">;
export type CreateHealthDataInput = Omit<UserHealthData, "profileId">;
export type CreateEmergencyContactInput = Omit<UserEmergencyContact, "id" | "profileId">;

export type UpdateUserProfileInput = Partial<CreateUserProfileInput>;
export type UpdateHealthDataInput = Partial<CreateHealthDataInput>;
export type UpdateEmergencyContactInput = Partial<CreateEmergencyContactInput>;

// =============================================================================
// AGGREGATE TYPES
// =============================================================================

export interface UserHealthProfile {
    readonly profile: UserProfile;
    readonly healthData: UserHealthData;
    readonly emergencyContacts: readonly UserEmergencyContact[];
}

export interface UserHealthProfileSummary {
    readonly id: string;
    readonly firstName: string | null;
    readonly lastName: string | null;
    readonly avatarUrl: string | null;
    readonly age: number | null;
    readonly gender: Gender | null;
    readonly hasDiabetes: boolean;
    readonly hasHypertension: boolean;
    readonly bloodType: BloodType | null;
}

// =============================================================================
// DATABASE ROW TYPES (RAW SUPABASE DATA)
// =============================================================================

export interface ProfileRow {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    birth_date: string | null;
    gender: Gender | null;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface HealthDataRow {
    profile_id: string;
    weight: number | null;
    height: number | null;
    blood_type: BloodType | null;
    allergies: string | null;
    chronic_conditions: string | null;
    has_diabetes: boolean;
    has_hypertension: boolean;
}

export interface EmergencyContactRow {
    id: string;
    profile_id: string;
    contact_name: string;
    phone_number: string;
    relationship: string;
    priority_order: number;
    created_at: string;
    updated_at: string;
}

// =============================================================================
// MAPPERS
// =============================================================================

export function mapToUserProfile(row: ProfileRow): UserProfile {
    return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        avatarUrl: row.avatar_url,
        birthDate: row.birth_date,
        gender: row.gender,
        onboardingCompleted: row.onboarding_completed,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function mapToUserHealthData(row: HealthDataRow): UserHealthData {
    return {
        profileId: row.profile_id,
        weight: row.weight,
        height: row.height,
        bloodType: row.blood_type,
        allergies: row.allergies,
        chronicConditions: row.chronic_conditions,
        hasDiabetes: row.has_diabetes,
        hasHypertension: row.has_hypertension,
    };
}

export function mapToUserEmergencyContact(row: EmergencyContactRow): UserEmergencyContact {
    return {
        id: row.id,
        profileId: row.profile_id,
        contactName: row.contact_name,
        phoneNumber: row.phone_number,
        relationship: row.relationship,
        priorityOrder: row.priority_order,
    };
}

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

export function createProfileSummary(
    profile: UserProfile,
    healthData: UserHealthData
): UserHealthProfileSummary {
    return {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
        age: calculateAge(profile.birthDate),
        gender: profile.gender,
        hasDiabetes: healthData.hasDiabetes,
        hasHypertension: healthData.hasHypertension,
        bloodType: healthData.bloodType,
    };
}
