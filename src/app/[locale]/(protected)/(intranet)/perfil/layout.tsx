import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { getSession } from "@/lib/session"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function ProfileLayout({ 
  children, 
  params 
}: ProfileLayoutProps) {
  const { locale } = await params
  const session = await getSession()

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale))
  }

  const supabase = await createClient()

  // Fetch user data for the sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", session.user.id)
    .single()

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-white max-w-[1600px] mx-auto">
      <ProfileSidebar locale={locale} />
      <main className="flex-1 overflow-y-auto px-4 lg:px-12 py-6 lg:py-8 bg-slate-50/30">
        {children}
      </main>
    </div>
  )
}
