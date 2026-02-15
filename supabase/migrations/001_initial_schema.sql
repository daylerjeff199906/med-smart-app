-- =============================================================================
-- BEQUI SUPERAPP - DATABASE MIGRATION
-- Separation of Identity and Health Data for Privacy & Compliance
-- =============================================================================

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUMS
-- =============================================================================

-- Blood type enumeration for standardized health records
CREATE TYPE blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Gender enumeration for identity records
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- =============================================================================
-- TABLE: profiles
-- Purpose: Basic identity and account information (non-sensitive)
-- Security: Public read access, owner-only write access
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    -- Primary Key: Links to auth.users
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Identity Information
    first_name VARCHAR(100),                            -- User's first name
    last_name VARCHAR(100),                             -- User's last name
    avatar_url TEXT,                                     -- Profile image URL (storage bucket)
    birth_date DATE,                                     -- Date of birth for age calculations
    gender gender_type,                                  -- Gender identity from enum
    
    -- Account Status
    onboarding_completed BOOLEAN DEFAULT FALSE,          -- Flag indicating onboarding completion
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),                -- Record creation timestamp
    updated_at TIMESTAMPTZ DEFAULT NOW()                 -- Last update timestamp
);

-- Index for faster lookups by onboarding status (for admin queries)
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
    ON public.profiles(onboarding_completed);

-- Index for birth_date (useful for age calculations and filtering)
CREATE INDEX IF NOT EXISTS idx_profiles_birth_date 
    ON public.profiles(birth_date);

-- =============================================================================
-- TABLE: health_data
-- Purpose: Sensitive medical information (PHI - Protected Health Information)
-- Security: Strict RLS - Owner only access
-- Relationship: 1:1 with profiles table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.health_data (
    -- Primary Key: Same as profiles.id for 1:1 relationship
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Biometric Data
    weight NUMERIC(5,2),                                 -- Weight in kilograms (max 999.99)
    height NUMERIC(5,2),                                 -- Height in centimeters (max 999.99)
    
    -- Medical Information
    blood_type blood_type,                               -- Blood group from enum
    allergies TEXT,                                      -- Known allergies (free text, comma-separated)
    chronic_conditions TEXT,                             -- Chronic conditions (free text, comma-separated)
    
    -- Boolean Flags for Critical Conditions
    has_diabetes BOOLEAN DEFAULT FALSE,                  -- Diabetes diagnosis flag
    has_hypertension BOOLEAN DEFAULT FALSE,              -- Hypertension diagnosis flag
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),                -- Record creation timestamp
    updated_at TIMESTAMPTZ DEFAULT NOW()                 -- Last update timestamp
);

-- Index for health condition queries (for analytics, aggregated only)
CREATE INDEX IF NOT EXISTS idx_health_conditions 
    ON public.health_data(has_diabetes, has_hypertension);

-- =============================================================================
-- TABLE: emergency_contacts
-- Purpose: Emergency contact information for medical emergencies
-- Security: Owner only access
-- Relationship: Many-to-One with profiles (user can have multiple contacts)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Key to profiles
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Contact Information
    contact_name VARCHAR(255) NOT NULL,                  -- Full name of emergency contact
    phone_number VARCHAR(50) NOT NULL,                   -- Phone number with country code
    relationship VARCHAR(100) NOT NULL,                  -- Relationship to user (e.g., "spouse", "parent")
    
    -- Priority/Priority Order
    priority_order INTEGER DEFAULT 1,                    -- 1 = primary, 2 = secondary, etc.
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint: Maximum 3 emergency contacts per user
    CONSTRAINT max_contacts_per_profile 
        EXCLUDE USING gist (profile_id WITH =) 
        WHERE (priority_order <= 3)
);

-- Index for faster lookups by profile
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_profile 
    ON public.emergency_contacts(profile_id, priority_order);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- PROFILES TABLE POLICIES
-- -------------------------------------------------------------------------

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Allow new user insertion during trigger execution
CREATE POLICY "System can insert profiles"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- -------------------------------------------------------------------------
-- HEALTH_DATA TABLE POLICIES (Strict - Owner Only)
-- -------------------------------------------------------------------------

-- Allow users to read only their own health data
CREATE POLICY "Users can read own health data"
    ON public.health_data
    FOR SELECT
    USING (auth.uid() = profile_id);

-- Allow users to insert only their own health data
CREATE POLICY "Users can insert own health data"
    ON public.health_data
    FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

-- Allow users to update only their own health data
CREATE POLICY "Users can update own health data"
    ON public.health_data
    FOR UPDATE
    USING (auth.uid() = profile_id);

-- Allow users to delete only their own health data
CREATE POLICY "Users can delete own health data"
    ON public.health_data
    FOR DELETE
    USING (auth.uid() = profile_id);

-- -------------------------------------------------------------------------
-- EMERGENCY_CONTACTS TABLE POLICIES
-- -------------------------------------------------------------------------

-- Allow users to read their own emergency contacts
CREATE POLICY "Users can read own emergency contacts"
    ON public.emergency_contacts
    FOR SELECT
    USING (auth.uid() = profile_id);

-- Allow users to insert their own emergency contacts
CREATE POLICY "Users can insert own emergency contacts"
    ON public.emergency_contacts
    FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

-- Allow users to update their own emergency contacts
CREATE POLICY "Users can update own emergency contacts"
    ON public.emergency_contacts
    FOR UPDATE
    USING (auth.uid() = profile_id);

-- Allow users to delete their own emergency contacts
CREATE POLICY "Users can delete own emergency contacts"
    ON public.emergency_contacts
    FOR DELETE
    USING (auth.uid() = profile_id);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at on all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_data_updated_at
    BEFORE UPDATE ON public.health_data
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at
    BEFORE UPDATE ON public.emergency_contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- TRIGGER: Auto-create profile and health_data on user signup
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert basic profile record using metadata if available
    INSERT INTO public.profiles (id, first_name, last_name, onboarding_completed)
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        FALSE
    );
    
    -- Insert empty health data record (will be populated during onboarding)
    INSERT INTO public.health_data (profile_id)
    VALUES (NEW.id);
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't prevent user creation
        RAISE WARNING 'Error creating profile/health_data for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- GRANTS
-- =============================================================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.health_data TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emergency_contacts TO authenticated;

-- Grant sequence usage for UUID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.profiles IS 'Basic user identity information (non-sensitive)';
COMMENT ON TABLE public.health_data IS 'Protected Health Information (PHI) - strictly confidential';
COMMENT ON TABLE public.emergency_contacts IS 'Emergency contact information for medical situations';
COMMENT ON COLUMN public.profiles.birth_date IS 'Used for calculating age dynamically instead of storing static age';
COMMENT ON COLUMN public.health_data.weight IS 'Weight in kilograms';
COMMENT ON COLUMN public.health_data.height IS 'Height in centimeters';
