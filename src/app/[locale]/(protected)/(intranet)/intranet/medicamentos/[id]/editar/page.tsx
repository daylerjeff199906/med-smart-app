"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { MedicationForm } from "@/features/medication/components/medication-form"
import { createClient } from "@/utils/supabase/client"

interface MedicationData {
  id: string
  name: string
  form: string
  dose_amount: number
  dose_unit: string
  frequency: string
  frequency_interval: number | null
  frequency_days: number[] | null
  times_of_day: string[] | null
  specific_times: string[] | null
  current_stock: number
  low_stock_threshold: number
  instructions: string | null
  start_date: string
  end_date: string | null
  expiration_date: string | null
  notify_via_email: boolean
  sync_to_calendar: boolean
}

export default function EditarMedicamentoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [medication, setMedication] = useState<MedicationData | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [medicationId] = useState(id)


  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/es/login")
        return
      }

      setUserId(session.user.id)

      const { data } = await supabase
        .from("medication_plans")
        .select("*")
        .eq("id", id)
        .eq("user_id", session.user.id)
        .single()

      if (!data) {
        router.push("/es/intranet/medicamentos")
        return
      }

      setMedication(data)
      setLoading(false)
    }

    loadData()
  }, [id, router])

  const handleSuccess = () => {
    router.push("/es/intranet/medicamentos")
  }

  const handleCancel = () => {
    router.push("/es/intranet/medicamentos")
  }

  if (loading || !medication || !userId) {
    return (
      <LayoutWrapper sectionTitle="Editar Medicamento">
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </LayoutWrapper>
    )
  }


  return (
    <LayoutWrapper sectionTitle="Editar Medicamento">
      <div className="p-6">
        <MedicationForm 
          userId={userId}
          medicationId={medicationId}
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
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          locale="es"
        />
      </div>
    </LayoutWrapper>
  )
}
