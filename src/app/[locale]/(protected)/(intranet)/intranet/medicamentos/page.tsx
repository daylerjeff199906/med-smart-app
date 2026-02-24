import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { createClient } from "@/utils/supabase/server"
import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { MedicationPageContent } from "@/features/medication/components/medication-page-content"
import { searchMedications } from "@/features/medication/actions/medication-actions"

export const metadata: Metadata = {
  title: "Medicamentos - Bequi",
  description: "Gestión de medicamentos de la SuperApp Médica Bequi",
}

interface MedicamentosPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; filter?: string }>
}

export default async function MedicamentosPage({ params, searchParams }: MedicamentosPageProps) {
  const { locale } = await params
  const { q, filter } = await searchParams

  const session = await getSession()

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.REGISTER, locale))
  }

  if (!session.onboardingCompleted) {
    redirect(getLocalizedRoute(ROUTES.ONBOARDING, locale))
  }

  const filterValue = filter as "all" | "active" | "inactive" | "low_stock" | "expiring_soon" | undefined

  const result = await searchMedications(
    session.user.id,
    q,
    filterValue
  )

  return (
    <LayoutWrapper sectionTitle="Medicamentos">
      <MedicationPageContent
        initialMedications={result.success ? (result.data || []) : []}
        locale={locale}
      />
    </LayoutWrapper>
  )
}
