import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { MedicationSchedule } from "@/features/medication/components/medication-schedule"

export const metadata: Metadata = {
  title: "Agenda de Medicamentos - Bequi",
  description: "Agenda y seguimiento de medicamentos",
}

interface AgendaPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AgendaPage({ params }: AgendaPageProps) {
  const { locale } = await params;
  const session = await getSession();

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
  }

  if (!session.onboardingCompleted) {
    redirect(getLocalizedRoute(ROUTES.ONBOARDING, locale));
  }

  return (
    <LayoutWrapper sectionTitle="Agenda de Medicamentos">
      <div className="p-6">
        <MedicationSchedule userId={session.user.id} />
      </div>
    </LayoutWrapper>
  )
}
