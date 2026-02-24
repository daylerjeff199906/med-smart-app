"use client"

import { useState } from "react"
import { MedicationList } from "./medication-list"
import { MedicationFilters } from "./medication-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { deleteMedicationPlan } from "../actions/medication-actions"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import type { Medication } from "./medication-filters"

interface MedicationPageContentProps {
  initialMedications: Medication[]
  locale: string
}

export function MedicationPageContent({ initialMedications, locale }: MedicationPageContentProps) {
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
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mis Medicamentos</h2>
            <p className="text-slate-500 text-sm">Gestiona tus tratamientos y recordatorios</p>
          </div>
          <Button onClick={handleAdd} className="bg-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Medicamento
          </Button>
        </div>

        <MedicationFilters />

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
