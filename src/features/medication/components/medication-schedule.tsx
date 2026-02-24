"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MedicationLogDialog } from "@/components/ui/medication-log-dialog"
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Calendar,
    ChevronLeft,
    ChevronRight,
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
        morning: "Mañana (6:00 - 12:00)",
        afternoon: "Tarde (12:00 - 17:00)",
        evening: "Noche (17:00 - 21:00)",
        night: "Madrugada (21:00 - 6:00)",
        specific: "Horario específico"
    }
    return labels[slot]
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
        const times = plan.specific_times || plan.times_of_day || ["08:00", "12:00", "18:00", "21:00"]

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
            className: "bg-amber-100 text-amber-700 border-amber-200",
            icon: <Clock className="w-3 h-3 mr-1" />
        },
        taken: {
            label: "Tomado",
            className: "bg-green-100 text-green-700 border-green-200",
            icon: <CheckCircle className="w-3 h-3 mr-1" />
        },
        skipped: {
            label: "Omitido",
            className: "bg-slate-100 text-slate-600 border-slate-200",
            icon: <XCircle className="w-3 h-3 mr-1" />
        },
        missed: {
            label: "Perdido",
            className: "bg-red-100 text-red-700 border-red-200",
            icon: <AlertCircle className="w-3 h-3 mr-1" />
        }
    }

    const { label, className, icon } = config[status] || config.pending

    return (
        <Badge variant="outline" className={`${className} flex items-center w-fit font-medium text-[10px] uppercase tracking-wider py-0 px-2 h-5`}>
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

    const { markMedicationAsTaken, markMedicationAsSkipped, restoreMedicationLog } = require("../actions/medication-actions")

    // Assign colors based on medication name or index to match the image's variety
    const colorClasses = [
        "bg-orange-50 border-orange-400 text-orange-900",
        "bg-rose-50 border-rose-400 text-rose-900",
        "bg-purple-50 border-purple-400 text-purple-900",
        "bg-sky-50 border-sky-400 text-sky-900",
        "bg-emerald-50 border-emerald-400 text-emerald-900",
    ]

    // Simple hash to consistently assign a color to a medication
    const colorIndex = plan.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorClasses.length
    const cardColor = status === 'taken' ? 'bg-slate-50 border-slate-200 text-slate-500 italic' : colorClasses[colorIndex]

    const handleOpenTaken = () => {
        setDialogType("taken")
        setDialogOpen(true)
    }

    const handleOpenSkipped = () => {
        setDialogType("skipped")
        setDialogOpen(true)
    }

    const handleDialogConfirm = async (notes?: string) => {
        if (dialogType === "taken") {
            await markMedicationAsTaken(
                plan.id,
                userId,
                new Date().toISOString().split("T")[0],
                time,
                plan.dose_amount
            )
        } else if (dialogType === "skipped") {
            await markMedicationAsSkipped(log?.id || "", notes || "Omitido")
        }
        onAction()
    }

    const handleRestore = async () => {
        if (log?.id) {
            await restoreMedicationLog(log.id)
            onAction()
        }
    }

    return (
        <div className={`group relative ml-4 mb-4 p-4 rounded-sm border-l-[6px] w-full shadow-sm transition-all duration-200 hover:shadow-md ${cardColor}`}>
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">{time}</span>
                        {status !== 'pending' && <StatusBadge status={status} />}
                    </div>
                    <h4 className={`font-bold text-lg leading-tight ${status === 'taken' ? 'line-through opacity-60' : ''}`}>
                        {plan.name}
                    </h4>
                    <p className="text-sm font-medium opacity-80 mt-0.5">
                        {plan.dose_amount} {plan.dose_unit} • {plan.form}
                    </p>
                    {plan.instructions && (
                        <p className="text-xs mt-2 opacity-70 italic line-clamp-2">
                            "{plan.instructions}"
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {status === "pending" ? (
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full hover:bg-white/50 cursor-pointer"
                                onClick={handleOpenTaken}
                                title="Marcar como tomado"
                            >
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full hover:bg-white/50 cursor-pointer"
                                onClick={handleOpenSkipped}
                                title="Omitir"
                            >
                                <XCircle className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-white/50"
                            onClick={handleRestore}
                            title="Restaurar"
                        >
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                        </Button>
                    )}
                </div>
            </div>

            <MedicationLogDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleDialogConfirm}
                title={dialogType === "taken" ? "Marcar como tomado" : "Omitir dosis"}
                description={dialogType === "taken"
                    ? `¿Confirmas que tomaste ${plan.name}?`
                    : `¿Estás seguro de omitir la dosis de ${plan.name}?`
                }
                confirmText={dialogType === "taken" ? "Confirmar" : "Omitir"}
                cancelText="Cancelar"
            />
        </div>
    )
}

function DaySchedule({ medications, userId, selectedDate, onRefresh, filter }: DayScheduleProps) {
    const dateStr = selectedDate.toISOString()
    const groups = groupMedicationsByTimeSlot(medications, dateStr)

    // Flatten all medications into a single array with their scheduled times
    const allMedications: MedicationSlot[] = Object.values(groups)
        .flat()
        .filter(slotItem => {
            const status = slotItem.log?.status || "pending"
            if (filter === "all") return true
            return status === filter
        })
        .sort((a, b) => a.time.localeCompare(b.time))

    if (allMedications.length === 0) {
        return (
            <div className="text-center py-20 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-1">Sin medicamentos</h3>
                <p className="text-slate-500 text-sm">No hay medicamentos programados para el filtro "{filter}"</p>
            </div>
        )
    }

    return (
        <div className="relative md:pl-12 py-4 w-full">
            {/* Vertical timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-200 -ml-4" />

            <div className="space-y-8">
                {allMedications.map((slot, index) => {
                    const hour = slot.time.split(':')[0]
                    const showHour = index === 0 || allMedications[index - 1].time.split(':')[0] !== hour

                    return (
                        <div key={`${slot.plan.id}-${slot.time}-${index}`} className="relative flex flex-col md:flex-row gap-1">
                            {/* Hour marker */}
                            {showHour && (
                                <div className="flex md:absolute md:-left-8 md:-left-12 top-0 w-8 md:w-12 text-right md:pr-4">
                                    <span className="text-xs font-bold text-slate-400">{slot.time}</span>
                                </div>
                            )}

                            {/* Timeline dot */}
                            <div className="hidden md:block absolute -left-6 md:-left-[69px] top-2 w-3 h-3 rounded-full border-2 border-white bg-primary shadow-sm z-10" />

                            <MedicationCard
                                slot={slot}
                                userId={userId}
                                onAction={onRefresh}
                            />
                        </div>
                    )
                })}

                {/* Visual indicator of the day end */}
                <div className="pt-4 flex items-center gap-4 opacity-30">
                    <div className="flex-1 h-[1px] bg-slate-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Fin del día</span>
                    <div className="flex-1 h-[1px] bg-slate-300" />
                </div>
            </div>
        </div>
    )
}

function CalendarSidebar({
    selectedDate,
    onDateSelect,
    medicationDates
}: {
    selectedDate: Date
    onDateSelect: (date: Date) => void
    medicationDates: string[]
}) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const medicationDatesSet = new Set(medicationDates)

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const days: (Date | null)[] = []

        // Adjust for Monday as first day of week if needed, but image shows Sunday
        const firstDayOfWeek = firstDay.getDay()
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null)
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i))
        }

        return days
    }

    const days = getDaysInMonth(currentMonth)
    const monthName = currentMonth.toLocaleDateString("es-ES", { month: "long" })
    const yearNumber = currentMonth.getFullYear()

    const isDateSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString()
    }

    const hasMedication = (date: Date) => {
        return medicationDatesSet.has(date.toISOString().split("T")[0])
    }

    const isToday = (date: Date) => {
        return date.toDateString() === new Date().toDateString()
    }

    const isFuture = (date: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date > today
    }

    const canGoNextMonth = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        // Can go next only if currentMonth's year/month is before today's year/month
        return currentMonth.getFullYear() < today.getFullYear() ||
            (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() < today.getMonth())
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-xl text-slate-900 capitalize px-2">
                        {monthName} <span className="font-normal text-slate-400">{yearNumber}</span>
                    </h3>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-slate-100"
                            onClick={() => {
                                const prev = new Date(currentMonth)
                                prev.setMonth(prev.getMonth() - 1)
                                setCurrentMonth(prev)
                            }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-slate-100 disabled:opacity-20"
                            onClick={() => {
                                const next = new Date(currentMonth)
                                next.setMonth(next.getMonth() + 1)
                                setCurrentMonth(next)
                            }}
                            disabled={!canGoNextMonth()}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                    {["D", "L", "M", "M", "J", "V", "S"].map((day, i) => (
                        <div key={i} className="text-[10px] font-black text-slate-300 py-2">{day}</div>
                    ))}
                    {days.map((date, i) => (
                        <div key={i} className="aspect-square flex items-center justify-center p-0.5">
                            {date ? (
                                <button
                                    onClick={() => onDateSelect(date)}
                                    disabled={isFuture(date)}
                                    className={`
                                        w-full h-full rounded-2xl text-xs font-bold transition-all duration-200
                                        ${isDateSelected(date)
                                            ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                                            : "text-slate-700 hover:bg-slate-50"}
                                        ${!isDateSelected(date) && isToday(date) ? "text-primary border border-primary/20" : ""}
                                        ${!isDateSelected(date) && hasMedication(date) ? "relative after:content-[''] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full" : ""}
                                        ${isFuture(date) ? "opacity-20 cursor-not-allowed" : ""}
                                    `}
                                >
                                    {date.getDate()}
                                </button>
                            ) : <div />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming / Mini Schedule */}
            <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 px-2">Próximos</h4>
                <div className="space-y-6">
                    <div className="flex gap-4 items-start px-2">
                        <div className="w-8 text-[10px] font-black text-slate-300 pt-0.5">08:00</div>
                        <div className="flex-1 h-[2px] bg-slate-100 mt-2 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-orange-400" />
                        </div>
                    </div>
                    <div className="flex gap-4 items-start px-2">
                        <div className="w-8 text-[10px] font-black text-slate-300 pt-0.5">14:00</div>
                        <div className="flex-1 h-[2px] bg-slate-100 mt-2 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-purple-400" />
                        </div>
                    </div>
                    <div className="flex gap-4 items-start px-2">
                        <div className="w-8 text-[10px] font-black text-slate-300 pt-0.5">20:00</div>
                        <div className="flex-1 h-[2px] bg-slate-100 mt-2 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MedicationSchedule({ userId }: { userId: string }) {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [medications, setMedications] = useState<MedicationPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"all" | "pending" | "taken" | "skipped">("all")
    const [medicationDates, setMedicationDates] = useState<string[]>([])

    const fetchSchedule = async () => {
        setLoading(true)
        const dateStr = selectedDate.toISOString().split("T")[0]
        const { getTodaySchedule } = require("../actions/medication-actions")
        const result = await getTodaySchedule(userId, dateStr)

        if (result.success && result.data) {
            setMedications(result.data)

            const dates = new Set<string>()
            result.data.forEach((plan: any) => {
                if (plan.start_date) dates.add(plan.start_date)
                if (plan.end_date) dates.add(plan.end_date)
            })
            setMedicationDates(Array.from(dates))
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSchedule()
    }, [selectedDate, userId])

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date)
    }

    const formatDate = (date: Date) => {
        const weekday = date.toLocaleDateString("es-ES", { weekday: "long" })
        const day = date.getDate()
        const month = date.toLocaleDateString("es-ES", { month: "long" })
        return { weekday, day, month }
    }

    const { weekday, day, month } = formatDate(selectedDate)

    const filters: { value: "all" | "pending" | "taken" | "skipped"; label: string }[] = [
        { value: "all", label: "Todo" },
        { value: "pending", label: "Pendiente" },
        { value: "taken", label: "Tomado" },
        { value: "skipped", label: "Omitido" },
    ]

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header / Date */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 capitalize">
                            {weekday}
                        </h2>
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <p className="text-xl text-slate-400 font-medium">
                        {day} de {month}
                    </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${filter === f.value
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Timeline - Left */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100">
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-6">
                                    <Skeleton className="w-12 h-6 rounded-full" />
                                    <Skeleton className="flex-1 h-32 rounded-3xl" />
                                </div>
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
                </div>

                {/* Sidebar - Right */}
                <div className="lg:col-span-4 space-y-6">
                    <CalendarSidebar
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        medicationDates={medicationDates}
                    />

                    <button
                        onClick={() => setSelectedDate(new Date())}
                        className="w-full py-4 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Volver a Hoy
                    </button>
                </div>
            </div>
        </div>
    )
}

