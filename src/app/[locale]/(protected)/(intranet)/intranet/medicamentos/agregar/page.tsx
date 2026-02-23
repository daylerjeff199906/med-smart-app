"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { MedicationForm } from "@/features/medication/components/medication-form"
import { createClient } from "@/utils/supabase/client"

export default function AgregarMedicamentoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/es/login")
        return
      }

      setUserId(session.user.id)
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleSuccess = () => {
    router.push("/es/intranet/medicamentos")
  }

  const handleCancel = () => {
    router.push("/es/intranet/medicamentos")
  }

  if (loading || !userId) {
    return (
      <LayoutWrapper sectionTitle="Agregar Medicamento">
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper sectionTitle="Agregar Medicamento">
      <div className="p-6">
        <MedicationForm 
          userId={userId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          locale="es"
        />
      </div>
    </LayoutWrapper>
  )
}
