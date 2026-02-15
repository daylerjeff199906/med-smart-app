-- =============================================================================
-- BEQUI SUPERAPP - DATABASE SCHEMA
-- Based on user's existing database structure
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
-- Purpose: Basic identity and account information
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    -- Primary Key: Links to auth.users
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Identity Information
    email VARCHAR(255) NOT NULL,                         -- User's email address
    first_name VARCHAR(255),                             -- User's first name
    last_name TEXT,                                      -- User's last name
    avatar_url TEXT,                                     -- Profile image URL
    birth_date DATE,                                     -- Date of birth
    gender gender_type,                                  -- Gender identity
    
    -- Account Status
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE, -- Onboarding completion flag
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for faster lookups by onboarding status
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
    ON public.profiles(onboarding_completed);

-- Index for birth_date (useful for age calculations)
CREATE INDEX IF NOT EXISTS idx_profiles_birth_date 
    ON public.profiles(birth_date);

-- =============================================================================
-- TABLE: health_data
-- Purpose: Sensitive medical information (PHI)
-- Relationship: 1:1 with profiles table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.health_data (
    -- Primary Key: Same as profiles.id for 1:1 relationship
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Biometric Data
    weight NUMERIC,                                      -- Weight in kilograms
    height NUMERIC,                                      -- Height in centimeters
    
    -- Medical Information
    blood_type blood_type,                               -- Blood group
    allergies TEXT,                                      -- Known allergies
    chronic_conditions TEXT,                             -- Chronic conditions
    
    -- Boolean Flags for Critical Conditions
    has_diabetes BOOLEAN DEFAULT false,                  -- Diabetes diagnosis
    has_hypertension BOOLEAN DEFAULT false               -- Hypertension diagnosis
);

-- Index for health condition queries
CREATE INDEX IF NOT EXISTS idx_health_conditions 
    ON public.health_data(has_diabetes, has_hypertension);

-- =============================================================================
-- TABLE: emergency_contacts
-- Purpose: Emergency contact information
-- Relationship: Many-to-One with profiles
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Key to profiles
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Contact Information
    contact_name VARCHAR(255) NOT NULL,                  -- Contact's full name
    phone_number VARCHAR(50) NOT NULL,                   -- Phone number
    relationship VARCHAR(100) NOT NULL,                  -- Relationship to user
    priority_order INTEGER DEFAULT 1                     -- Priority (1=primary)
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

-- Profiles policies
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Health data policies (owner only)
CREATE POLICY "Users can read own health data"
    ON public.health_data
    FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own health data"
    ON public.health_data
    FOR UPDATE
    USING (auth.uid() = profile_id);

-- Emergency contacts policies
CREATE POLICY "Users can manage own emergency contacts"
    ON public.emergency_contacts
    FOR ALL
    USING (auth.uid() = profile_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- TRIGGER: Auto-create profile and health_data on user signup
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert profile with email and names from metadata
    INSERT INTO public.profiles (id, email, first_name, last_name, onboarding_completed)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', NULL),
        COALESCE(NEW.raw_user_meta_data->>'last_name', NULL),
        FALSE
    );
    
    -- Insert empty health data record
    INSERT INTO public.health_data (profile_id)
    VALUES (NEW.id);
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creating profile/health_data for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- GRANTS
-- =============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.health_data TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emergency_contacts TO authenticated;
