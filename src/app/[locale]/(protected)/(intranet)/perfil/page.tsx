import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { getSession } from "@/lib/session"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { ProfileForm } from "@/features/profile/components/profile-form"

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
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

    if (!profile) {
        redirect(getLocalizedRoute(ROUTES.DASHBOARD, locale));
    }

    const defaultValues = {
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        birthDate: profile.birth_date || "",
        gender: profile.gender || undefined,
        avatarUrl: profile.avatar_url || "",
    };

    return (
        <LayoutWrapper sectionTitle="Perfil">
            <ProfileForm defaultValues={defaultValues} />
        </LayoutWrapper>
    );
}
