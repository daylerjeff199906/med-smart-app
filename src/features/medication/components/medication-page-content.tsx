"use client"

import { useState } from "react"
import { MedicationList } from "./medication-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { deleteMedicationPlan } from "../actions/medication-actions"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { MedicationForm as MedForm, DoseUnit, MedicationFrequency } from "../types/medication"

interface Medication {
    id: string
    name: string
    form: MedForm
    dose_amount: number
    dose_unit: DoseUnit
    frequency: MedicationFrequency
    frequency_interval?: number | null
    frequency_days?: number[] | null
    specific_times?: string[] | null
    times_of_day?: string[] | null
    instructions?: string | null
    current_stock: number
    low_stock_threshold: number
    expiration_date?: string | null
    start_date: string
    end_date?: string | null
    notify_via_email: boolean
    sync_to_calendar: boolean
    is_active: boolean
}

interface MedicationPageContentProps {
  initialMedications: Medication[]
  userId: string
  locale: string
}

export function MedicationPageContent({ initialMedications, userId, locale }: MedicationPageContentProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null)

  const handleAdd = () => {
    router.push(`/${locale}/intranet/medicamentos/agregar`)
  }

  const handleEdit = (medication: Medication) => {
    router.push(`/${locale}/intranet/medicamentos/${medication.id}/editar`)
  }

  const handleDeleteClick = (id: string) => {
    setMedicationToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (medicationToDelete) {
      await deleteMedicationPlan(medicationToDelete)
      router.refresh()
      setMedicationToDelete(null)
    }
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Mis Medicamentos</h2>
            <p className="text-slate-500">Gestiona tus tratamientos y recordatorios</p>
          </div>
          <Button onClick={handleAdd} className="bg-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Medicamento
          </Button>
        </div>

        <MedicationList 
          medications={initialMedications}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAdd={handleAdd}
        />
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Eliminar medicamento"
        description="¿Estás seguro de que deseas eliminar este medicamento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  )
}
