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
    onMarkTaken?: (id: string) => void
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

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

function getIsExpiringSoon(expirationDate: string | null | undefined): boolean {
    if (!expirationDate) return false
    const expirationTime = new Date(expirationDate).getTime()
    return expirationTime <= (Date.now() + THIRTY_DAYS_MS)
}

export function MedicationCard({ medication, onEdit, onDelete, onMarkTaken }: MedicationCardProps) {
    const [showActions, setShowActions] = useState(false)
    const isLowStock = medication.current_stock <= medication.low_stock_threshold
    const isExpiringSoon = getIsExpiringSoon(medication.expiration_date)

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Pill className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{medication.name}</h3>
                        <p className="text-sm text-slate-500">
                            {medication.dose_amount} {medication.dose_unit} • {formLabels[medication.form] || medication.form}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-400">{frequencyLabels[medication.frequency] || medication.frequency}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isLowStock && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            <span className="text-xs text-amber-600 font-medium">{medication.current_stock} unidades</span>
                        </div>
                    )}
                    {isExpiringSoon && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg">
                            <Calendar className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-600 font-medium">Caduca pronto</span>
                        </div>
                    )}
                    
                    <div className="relative">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setShowActions(!showActions)}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>

                        {showActions && (
                            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10 min-w-[140px]">
                                <button
                                    onClick={() => {
                                        onEdit?.(medication)
                                        setShowActions(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        onMarkTaken?.(medication.id)
                                        setShowActions(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-green-600"
                                >
                                    <Check className="w-4 h-4" />
                                    Marcar tomado
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete?.(medication.id)
                                        setShowActions(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {medication.instructions && (
                <p className="mt-3 text-sm text-slate-500 bg-slate-50 rounded-lg p-2">
                    {medication.instructions}
                </p>
            )}

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    {medication.notify_via_email && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Email
                        </span>
                    )}
                    {medication.sync_to_calendar && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            Calendar
                        </span>
                    )}
                </div>
                <div className="text-xs text-slate-400">
                    Stock: {medication.current_stock}
                </div>
            </div>
        </div>
    )
}

interface MedicationListProps {
    medications: Medication[]
    onEdit?: (medication: Medication) => void
    onDelete?: (id: string) => void
    onMarkTaken?: (id: string) => void
    onAdd?: () => void
}

export function MedicationList({ medications, onEdit, onDelete, onMarkTaken, onAdd }: MedicationListProps) {
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
                    onMarkTaken={onMarkTaken}
                />
            ))}
        </div>
    )
}
