"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 animate-in zoom-in-95">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors",
              variant === "destructive" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-slate-900 hover:bg-slate-800"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
