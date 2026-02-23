"use client"

import { Pill, Clock, Calendar, AlertTriangle, Edit, Trash2, Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MedicationForm, DoseUnit, MedicationFrequency } from "../types/medication"

interface Medication {
    id: string
    name: string
    form: MedicationForm
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

interface MedicationCardProps {
    medication: Medication
    onEdit?: (medication: Medication) => void
    onDelete?: (id: string) => void
}

const formLabels: Record<string, string> = {
    tablet: "Tableta",
    capsule: "Cápsula",
    liquid: "Líquido",
    injection: "Inyección",
    inhaler: "Inhalador",
    cream: "Crema",
    drops: "Gotas",
    patch: "Parche",
    suppository: "Supositorio",
    other: "Otro"
}

const frequencyLabels: Record<string, string> = {
    once_daily: "1 vez/día",
    twice_daily: "2 veces/día",
    three_times_daily: "3 veces/día",
    four_times_daily: "4 veces/día",
    every_x_hours: "Cada X horas",
    as_needed: "Según necesidad",
    weekly: "Semanal",
    specific_days: "Días específicos"
}

const dayLabels: Record<number, string> = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado"
}

function getFrequencyLabel(frequency: string, interval?: number | null, days?: number[] | null): string {
    if (frequency === "every_x_hours" && interval) {
        return `Cada ${interval} horas`
    }
    if (frequency === "specific_days" && days && days.length > 0) {
        const dayNames = days.map(d => dayLabels[d] || "").filter(Boolean)
        return dayNames.join(", ")
    }
    return frequencyLabels[frequency] || frequency
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

function getIsExpiringSoon(expirationDate: string | null | undefined): boolean {
    if (!expirationDate) return false
    const expirationTime = new Date(expirationDate).getTime()
    return expirationTime <= (Date.now() + THIRTY_DAYS_MS)
}

export function MedicationCard({ medication, onEdit, onDelete }: MedicationCardProps) {
    const isLowStock = medication.current_stock <= medication.low_stock_threshold
    const isExpiringSoon = getIsExpiringSoon(medication.expiration_date)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Pill className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-bold text-slate-900 text-sm">{medication.name}</h3>
                        {isLowStock && (
                            <span className="text-xs text-amber-600">Stock bajo: {medication.current_stock} uds</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                        onClick={() => onEdit?.(medication)}
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => onDelete?.(medication.id)}
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Dosis</p>
                        <p className="text-sm font-medium text-slate-700">{medication.dose_amount} {medication.dose_unit}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Forma</p>
                        <p className="text-sm font-medium text-slate-700">{formLabels[medication.form] || medication.form}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Frecuencia</p>
                        <p className="text-sm font-medium text-slate-700">
                            {getFrequencyLabel(medication.frequency, medication.frequency_interval, medication.frequency_days)}
                        </p>
                    </div>
                </div>

                {(medication.specific_times || medication.times_of_day) && (
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Horarios</p>
                        <p className="text-sm font-medium text-slate-700">
                            {(medication.specific_times || medication.times_of_day)?.join(", ")}
                        </p>
                    </div>
                )}

                {medication.instructions && (
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Instrucciones</p>
                        <p className="text-sm text-slate-600">{medication.instructions}</p>
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                    {isExpiringSoon && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>Caduca pronto</span>
                        </div>
                    )}
                    {medication.notify_via_email && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Notificaciones email
                        </span>
                    )}
                    {medication.sync_to_calendar && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            Sincronizado
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

interface MedicationListProps {
    medications: Medication[]
    onEdit?: (medication: Medication) => void
    onDelete?: (id: string) => void
    onAdd?: () => void
}

export function MedicationList({ medications, onEdit, onDelete, onAdd }: MedicationListProps) {
    if (medications.length === 0) {
        return (
            <div className="bg-slate-50 rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200">
                <Pill className="w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-800">No hay medicamentos</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">Agrega tu primer medicamento para comenzar.</p>
                {onAdd && (
                    <Button
                        type="button"
                        onClick={onAdd}
                        className="h-10 rounded-xl bg-slate-900 border-none px-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Medicamento
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {medications.map((medication) => (
                <MedicationCard
                    key={medication.id}
                    medication={medication}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
