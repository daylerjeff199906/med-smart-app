import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { MedicationForm } from "@/features/medication/components/medication-form"

interface AgregarMedicamentoPageProps {
  params: Promise<{ locale: string }>
}

export default async function AgregarMedicamentoPage({ params }: AgregarMedicamentoPageProps) {
  const { locale } = await params
  const session = await getSession()

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale))
  }

  return (
    <LayoutWrapper sectionTitle="Agregar Medicamento">
      <div className="p-6">
        <MedicationForm
          userId={session.user.id}
          locale={locale}
        />
      </div>
    </LayoutWrapper>
  )
}
