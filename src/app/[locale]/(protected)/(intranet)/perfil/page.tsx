import { getSession } from "@/lib/session"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { ProfileForm } from "@/features/profile/components/profile-form"
import type { ProfileInput } from "@/features/profile/types/profile"

interface ProfilePageProps {
    params: Promise<{ locale: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { locale } = await params
    const session = await getSession()

    if (!session) {
        redirect(getLocalizedRoute(ROUTES.LOGIN, locale))
    }

    const supabase = await createClient()

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, birth_date, gender, avatar_url")
        .eq("id", session.user.id)
        .single()

    if (error || !profile) {
        console.error("Error fetching profile:", error)
        redirect(getLocalizedRoute(ROUTES.DASHBOARD, locale))
    }

    const initialData: ProfileInput = {
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        birthDate: profile.birth_date || "",
        gender: (profile.gender as ProfileInput["gender"]) || undefined,
        avatarUrl: profile.avatar_url || "",
    }

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <ProfileForm
                defaultValues={initialData}
                locale={locale}
            />
        </div>
    )
}
