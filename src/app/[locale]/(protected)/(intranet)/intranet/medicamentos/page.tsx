import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { createClient } from "@/utils/supabase/server"
import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { MedicationPageContent } from "@/features/medication/components/medication-page-content"

export const metadata: Metadata = {
  title: "Medicamentos - Bequi",
  description: "Gestión de medicamentos de la SuperApp Médica Bequi",
}

interface MedicamentosPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MedicamentosPage({ params }: MedicamentosPageProps) {
  const { locale } = await params;
  const session = await getSession();

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
  }

  if (!session.onboardingCompleted) {
    redirect(getLocalizedRoute(ROUTES.ONBOARDING, locale));
  }

  const supabase = await createClient();
  
  const { data: medications } = await supabase
    .from("medication_plans")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <LayoutWrapper sectionTitle="Medicamentos">
      <MedicationPageContent 
        initialMedications={medications || []} 
        userId={session.user.id}
        locale={locale} 
      />
    </LayoutWrapper>
  )
}
