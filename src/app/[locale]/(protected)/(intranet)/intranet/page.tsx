import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { createClient } from "@/utils/supabase/server"
import { DashboardContent } from "@/features/dashboard/components/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard - Bequi",
  description: "Panel de control de la SuperApp Médica Bequi",
}

interface IntranetPageProps {
  params: Promise<{ locale: string }>;
}

export default async function IntranetPage({ params }: IntranetPageProps) {
  const { locale } = await params;
  const session = await getSession();

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
  }

  if (!session.onboardingCompleted) {
    redirect(getLocalizedRoute(ROUTES.ONBOARDING, locale));
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, health_data(*)")
    .eq("id", session.user.id)
    .single();

  return (
    <LayoutWrapper sectionTitle="Dashboard">
      <DashboardContent profile={profile} locale={locale} />
    </LayoutWrapper>
  )
}
