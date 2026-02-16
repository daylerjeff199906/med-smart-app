import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/intranet/app-sidebar"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const session = await getSession()
  const { locale } = await params

  if (!session) {
    redirect(`/${locale}/login`)
  }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url, email")
    .eq("id", session.user.id)
    .single()

  const activeUser = { // Renamed 'user' to 'activeUser' as per instruction context
    name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email.split('@')[0] : session.user.email,
    email: profile?.email || session.user.email,
    avatar: profile?.avatar_url || "",
  }

  return (
    <SidebarProvider>
      <AppSidebar user={activeUser} /> {/* Pass activeUser to AppSidebar */}
      {children}
    </SidebarProvider>
  )
}
