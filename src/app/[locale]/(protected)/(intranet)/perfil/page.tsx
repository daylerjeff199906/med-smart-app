import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { getSession } from "@/lib/session"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { ProfileSettings } from "@/features/profile/components/profile-settings"

interface ProfilePageProps {
    params: Promise<{ locale: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { locale } = await params;
    const session = await getSession();

    if (!session) {
        redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
    }

    const supabase = await createClient();

    // Fetch profile, health data and emergency contacts in parallel
    const [
        { data: profile },
        { data: healthData },
        { data: emergencyContacts }
    ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", session.user.id).single(),
        supabase.from("health_data").select("*").eq("profile_id", session.user.id).single(),
        supabase.from("emergency_contacts").select("*").eq("profile_id", session.user.id).order('priority_order', { ascending: true })
    ]);

    if (!profile) {
        redirect(getLocalizedRoute(ROUTES.DASHBOARD, locale));
    }

    const initialData = {
        profile: {
            firstName: profile.first_name || "",
            lastName: profile.last_name || "",
            email: profile.email || "",
            birthDate: profile.birth_date || "",
            gender: profile.gender || undefined,
            avatarUrl: profile.avatar_url || "",
        },
        health: {
            weight: healthData?.weight || "",
            height: healthData?.height || "",
            bloodType: healthData?.blood_type || undefined,
            allergies: healthData?.allergies || "",
            chronicConditions: healthData?.chronic_conditions || "",
            hasDiabetes: healthData?.has_diabetes || false,
            hasHypertension: healthData?.has_hypertension || false,
        },
        emergency: {
            contacts: (emergencyContacts || []).map((c: any) => ({
                id: c.id,
                contactName: c.contact_name,
                phoneNumber: c.phone_number,
                relationship: c.relationship,
                priorityOrder: c.priority_order,
            }))
        }
    };

    return (
        <LayoutWrapper sectionTitle="Perfil">
            <ProfileSettings initialData={initialData} />
        </LayoutWrapper>
    );
}
