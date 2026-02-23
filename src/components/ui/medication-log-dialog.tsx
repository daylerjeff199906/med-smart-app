"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface MedicationLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (notes?: string) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  showNotes?: boolean
}

export function MedicationLogDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  showNotes = true,
}: MedicationLogDialogProps) {
  const [notes, setNotes] = React.useState("")

  const handleConfirm = () => {
    onConfirm(notes || undefined)
    setNotes("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setNotes("")
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 animate-in zoom-in-95">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        
        {showNotes && (
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">
              Agregar nota (opcional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sentí mareo, tomé después de comer, etc."
              className="mt-1"
              rows={3}
            />
          </div>
        )}
        
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
