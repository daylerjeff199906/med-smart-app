export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Database schema for Bequi SuperApp
 * Separates identity data (profiles) from sensitive health data (health_data)
 */
export interface Database {
  public: {
    Tables: {
      /**
       * Basic user identity and account information (non-sensitive)
       * 1:1 relationship with auth.users
       */
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          birth_date: string | null  // ISO date string (YYYY-MM-DD)
          gender: "male" | "female" | "other" | "prefer_not_to_say" | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      
      /**
       * Protected Health Information (PHI) - Sensitive medical data
       * 1:1 relationship with profiles (strict RLS - owner only)
       */
      health_data: {
        Row: {
          profile_id: string
          weight: number | null  // kg
          height: number | null  // cm
          blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null
          allergies: string | null
          chronic_conditions: string | null
          has_diabetes: boolean
          has_hypertension: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          profile_id?: string
          weight?: number | null
          height?: number | null
          blood_type?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null
          allergies?: string | null
          chronic_conditions?: string | null
          has_diabetes?: boolean
          has_hypertension?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          profile_id?: string
          weight?: number | null
          height?: number | null
          blood_type?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null
          allergies?: string | null
          chronic_conditions?: string | null
          has_diabetes?: boolean
          has_hypertension?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_data_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      
      /**
       * Emergency contacts for medical situations
       * Many-to-1 relationship with profiles (owner only access)
       */
      emergency_contacts: {
        Row: {
          id: string
          profile_id: string
          contact_name: string
          phone_number: string
          relationship: string
          priority_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string
          contact_name?: string
          phone_number?: string
          relationship?: string
          priority_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          contact_name?: string
          phone_number?: string
          relationship?: string
          priority_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in string]: {
        Row: {
          [_ in string]: Json
        }
      }
    }
    Functions: {
      [_ in string]: {
        Args: {
          [_ in string]: Json
        }
        Returns: Json
      }
    }
    Enums: {
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
    }
    CompositeTypes: {
      [_ in string]: {
        [_ in string]: Json
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Convenience type aliases
export type Profile = Tables<'profiles'>
export type HealthData = Tables<'health_data'>
export type EmergencyContact = Tables<'emergency_contacts'>
