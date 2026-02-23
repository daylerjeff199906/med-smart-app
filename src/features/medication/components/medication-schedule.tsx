"use client"

import { useState, useEffect } from "react"
import { getTodaySchedule, markMedicationAsTaken, markMedicationAsSkipped, createMedicationLog, restoreMedicationLog } from "../actions/medication-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MedicationLogDialog } from "@/components/ui/medication-log-dialog"
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Pill,
    Calendar,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MedicationLog {
    id: string
    scheduled_date: string
    scheduled_time: string | null
    actual_taken_time: string | null
    status: string
    notes: string | null
    dose_taken: number | null
    missed_reason: string | null
}

interface MedicationPlan {
    id: string
    name: string
    form: string
    dose_amount: number
    dose_unit: string
    frequency: string
    specific_times?: string[] | null
    times_of_day?: string[] | null
    instructions?: string | null
    current_stock: number
    medication_logs?: MedicationLog[]
}

interface DayScheduleProps {
    medications: MedicationPlan[]
    userId: string
    selectedDate: Date
    onRefresh: () => void
    filter: "all" | "pending" | "taken" | "skipped"
}

type TimeSlot = "morning" | "afternoon" | "evening" | "night" | "specific"

interface MedicationSlot {
    plan: MedicationPlan
    time: string
    log?: MedicationLog
}

function getTimeSlot(timeStr: string): TimeSlot {
    const hour = parseInt(timeStr.split(":")[0])
    if (hour >= 6 && hour < 12) return "morning"
    if (hour >= 12 && hour < 17) return "afternoon"
    if (hour >= 17 && hour < 21) return "evening"
    return "night"
}

function getTimeSlotLabel(slot: TimeSlot): string {
    const labels: Record<TimeSlot, string> = {
        morning: "Mañana",
        afternoon: "Tarde",
        evening: "Noche",
        night: "Madrugada",
        specific: "Horario específico"
    }
    return labels[slot]
}

function getDefaultTimes(): string[] {
    return ["08:00", "12:00", "18:00", "21:00"]
}

function groupMedicationsByTimeSlot(medications: MedicationPlan[], dateStr: string): Record<TimeSlot, MedicationSlot[]> {
    const groups: Record<TimeSlot, MedicationSlot[]> = {
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
        specific: []
    }
    const dateKey = dateStr.split("T")[0]

    medications.forEach(plan => {
        const times = plan.specific_times || plan.times_of_day || getDefaultTimes()

        times.forEach(time => {
            const log = plan.medication_logs?.find(l =>
                l.scheduled_date === dateKey &&
                (l.scheduled_time === time || l.scheduled_time?.startsWith(time.split(":")[0]))
            )

            const slot: MedicationSlot = { plan, time, log }

            if (plan.specific_times) {
                groups.specific.push(slot)
            } else {
                const timeSlot = getTimeSlot(time)
                groups[timeSlot].push(slot)
            }
        })
    })

    Object.keys(groups).forEach(key => {
        groups[key as TimeSlot].sort((a, b) => a.time.localeCompare(b.time))
    })

    return groups
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
        pending: {
            label: "Pendiente",
            className: "bg-yellow-100 text-yellow-800 border-yellow-300",
            icon: <Clock className="w-3 h-3 mr-1" />
        },
        taken: {
            label: "Tomado",
            className: "bg-green-100 text-green-800 border-green-300",
            icon: <CheckCircle className="w-3 h-3 mr-1" />
        },
        skipped: {
            label: "Omitido",
            className: "bg-gray-100 text-gray-800 border-gray-300",
            icon: <XCircle className="w-3 h-3 mr-1" />
        },
        missed: {
            label: "Perdido",
            className: "bg-red-100 text-red-800 border-red-300",
            icon: <AlertCircle className="w-3 h-3 mr-1" />
        }
    }

    const { label, className, icon } = config[status] || config.pending

    return (
        <Badge variant="outline" className={`${className} flex items-center w-fit`}>
            {icon}
            {label}
        </Badge>
    )
}

function MedicationCard({
    slot,
    userId,
    onAction
}: {
    slot: MedicationSlot
    userId: string
    onAction: () => void
}) {
    const { plan, time, log } = slot
    const status = log?.status || "pending"
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState<"taken" | "skipped" | null>(null)

    const handleTaken = async (notes?: string) => {
        await markMedicationAsTaken(
            plan.id,
            userId,
            new Date().toISOString().split("T")[0],
            time,
            plan.dose_amount
        )
        if (notes) {
            if (log?.id) {
                const { updateMedicationLog } = await import("../actions/medication-actions")
                await updateMedicationLog(log.id, { notes })
            }
        }
        onAction()
    }

    const handleSkipped = async (notes?: string) => {
        const reason = notes || "Omitido por el usuario"
        if (log?.id) {
            await markMedicationAsSkipped(log.id, reason)
        } else {
            await createMedicationLog({
                planId: plan.id,
                userId: userId,
                scheduledDate: new Date().toISOString().split("T")[0],
                scheduledTime: time,
                status: "skipped",
                notes: notes || undefined,
            }, userId)
        }
        onAction()
    }

    const handleOpenTaken = () => {
        setDialogType("taken")
        setDialogOpen(true)
    }

    const handleOpenSkipped = () => {
        setDialogType("skipped")
        setDialogOpen(true)
    }

    const handleDialogConfirm = (notes?: string) => {
        if (dialogType === "taken") {
            handleTaken(notes)
        } else if (dialogType === "skipped") {
            handleSkipped(notes)
        }
    }

    const handleRestore = async () => {
        if (log?.id) {
            await restoreMedicationLog(log.id)
            onAction()
        }
    }

    return (
        <>
            <div className={`p-4 rounded-lg border ${status === 'taken' ? 'bg-green-50 border-green-200' : status === 'skipped' ? 'bg-gray-50 border-gray-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-start justify-between gap-3 flex-col md:flex-row">
                    <div className="flex items-start gap-3">
                        <div className="hidden md:flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center flex-shrink-0">
                            <Pill className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 text-sm md:text-base">{plan.name}</h4>
                            <p className="text-sm text-slate-600">
                                {plan.dose_amount} {plan.dose_unit} • {plan.form}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-500">{time}</span>
                            </div>
                            {plan.instructions && (
                                <p className="text-xs text-slate-400 mt-1">{plan.instructions}</p>
                            )}
                        </div>
                        <div className="md:hidden">
                            <StatusBadge status={status} />
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="hidden md:flex">
                            <StatusBadge status={status} />
                        </div>

                        {status === "pending" && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 rounded-full"
                                    onClick={handleOpenTaken}
                                >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Tomar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-gray-500 border-gray-200 hover:bg-gray-50 rounded-full"
                                    onClick={handleOpenSkipped}
                                >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Omitir
                                </Button>
                            </div>
                        )}

                        {(status === "taken" || status === "skipped") && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300 rounded-full"
                                onClick={handleRestore}
                            >
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Restaurar
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <MedicationLogDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleDialogConfirm}
                title={dialogType === "taken" ? "Marcar como tomado" : "Omitir dosis"}
                description={dialogType === "taken"
                    ? `¿Confirmas que tomaste ${plan.name} (${plan.dose_amount} ${plan.dose_unit})?`
                    : `¿Estás seguro de omitir la dosis de ${plan.name}?`
                }
                confirmText={dialogType === "taken" ? "Confirmar" : "Omitir"}
                cancelText="Cancelar"
            />
        </>
    )
}

function DaySchedule({ medications, userId, selectedDate, onRefresh, filter }: DayScheduleProps) {
    const dateStr = selectedDate.toISOString()
    const groups = groupMedicationsByTimeSlot(medications, dateStr)

    const order: TimeSlot[] = ["morning", "afternoon", "evening", "night", "specific"]

    const filteredGroups = Object.fromEntries(
        Object.entries(groups).map(([slot, slots]) => [
            slot,
            slots.filter(slotItem => {
                const status = slotItem.log?.status || "pending"
                if (filter === "all") return true
                return status === filter
            })
        ])
    ) as Record<TimeSlot, MedicationSlot[]>

    const hasAnyMedication = order.some(slot => filteredGroups[slot].length > 0)

    if (!hasAnyMedication) {
        return (
            <div className="text-center py-12 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No hay medicamentos programados para este día</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {order.map(slot => {
                if (filteredGroups[slot].length === 0) return null

                const takenCount = filteredGroups[slot].filter(s => s.log?.status === "taken").length
                const total = filteredGroups[slot].length

                return (
                    <div key={slot}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-slate-800 text-sm">{getTimeSlotLabel(slot)}</h3>
                            <span className="text-sm text-slate-500">
                                {takenCount}/{total} tomados
                            </span>
                        </div>
                        <div className="space-y-2">
                            {filteredGroups[slot].map((slotItem, idx) => (
                                <MedicationCard
                                    key={`${slotItem.plan.id}-${slotItem.time}-${idx}`}
                                    slot={slotItem}
                                    userId={userId}
                                    onAction={onRefresh}
                                />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export function MedicationSchedule({ userId }: { userId: string }) {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [medications, setMedications] = useState<MedicationPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"all" | "pending" | "taken" | "skipped">("all")

    const fetchSchedule = async () => {
        setLoading(true)
        const dateStr = selectedDate.toISOString().split("T")[0]
        const result = await getTodaySchedule(userId, dateStr)

        if (result.success && result.data) {
            setMedications(result.data)
        }
        setLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchSchedule()
    }, [selectedDate, userId])

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() + days)
        setSelectedDate(newDate)
    }

    const isToday = selectedDate.toDateString() === new Date().toDateString()

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const filters: { value: "all" | "pending" | "taken" | "skipped"; label: string }[] = [
        { value: "all", label: "Todos" },
        { value: "pending", label: "Pendientes" },
        { value: "taken", label: "Tomados" },
        { value: "skipped", label: "Omitidos" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Agenda de Medicamentos</h2>
                    <p className="text-slate-500 text-sm">Visualiza y gestiona tus medicamentos del día</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f.value
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => changeDate(-1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-center">
                            <p className="font-semibold text-slate-900 capitalize">
                                {formatDate(selectedDate)}
                            </p>
                            {isToday && (
                                <Badge variant="secondary" className="mt-1">Hoy</Badge>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => changeDate(1)}
                            disabled={isToday}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton key={index} className="h-20 rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <DaySchedule
                            medications={medications}
                            userId={userId}
                            selectedDate={selectedDate}
                            onRefresh={fetchSchedule}
                            filter={filter}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
