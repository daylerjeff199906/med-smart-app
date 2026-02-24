import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { MedicationForm } from "@/features/medication/components/medication-form"
import { createClient } from "@/utils/supabase/server"

interface EditarMedicamentoPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditarMedicamentoPage({ params }: EditarMedicamentoPageProps) {
  const { locale, id } = await params
  const session = await getSession()

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale))
  }

  const supabase = await createClient()
  const { data: medication, error } = await supabase
    .from("medication_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single()

  if (error || !medication) {
    console.error("Error fetching medication:", error)
    redirect(getLocalizedRoute(ROUTES.MEDICATION, locale))
  }

  return (
    <LayoutWrapper sectionTitle="Editar Medicamento">
      <div className="p-6">
        <MedicationForm
          userId={session.user.id}
          medicationId={id}
          defaultValues={{
            name: medication.name,
            form: medication.form,
            doseAmount: medication.dose_amount,
            doseUnit: medication.dose_unit,
            frequency: medication.frequency,
            currentStock: medication.current_stock,
            lowStockThreshold: medication.low_stock_threshold,
            instructions: medication.instructions || undefined,
            startDate: medication.start_date,
            expirationDate: medication.expiration_date || undefined,
            notifyViaEmail: medication.notify_via_email,
            syncToCalendar: medication.sync_to_calendar,
          }}
          locale={locale}
        />
      </div>
    </LayoutWrapper>
  )
}
