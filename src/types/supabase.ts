import { ProfileRow, HealthDataRow, EmergencyContactRow, Gender, BloodType } from "./health-profile";

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: ProfileRow;
                Insert: Partial<Omit<ProfileRow, "id">> & { id: string };
                Update: Partial<ProfileRow>;
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            };
            health_data: {
                Row: HealthDataRow;
                Insert: Partial<Omit<HealthDataRow, "profile_id">> & { profile_id: string };
                Update: Partial<HealthDataRow>;
                Relationships: [
                    {
                        foreignKeyName: "health_data_profile_id_fkey"
                        columns: ["profile_id"]
                        isOneToOne: true
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            };
            emergency_contacts: {
                Row: EmergencyContactRow;
                Insert: Omit<EmergencyContactRow, "id" | "created_at" | "updated_at"> & { id?: string };
                Update: Partial<EmergencyContactRow>;
                Relationships: [
                    {
                        foreignKeyName: "emergency_contacts_profile_id_fkey"
                        columns: ["profile_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            };
        };
        Views: {
            [_ in string]: {
                Row: {
                    [_ in string]: Json
                }
            }
        };
        Functions: {
            [_ in string]: {
                Args: {
                    [_ in string]: Json
                }
                Returns: Json
            }
        };
        Enums: {
            gender_type: Gender;
            blood_type: BloodType;
        };
        CompositeTypes: {
            [_ in string]: {
                [_ in string]: Json
            }
        };
    };
}
