"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CalendarDays, X, Clock, Calendar, Package } from "lucide-react"
import { createMedicationPlan, updateMedicationPlan } from "../actions/medication-actions"
import { MedicationPlanInput } from "../types/medication"

interface MedicationFormProps {
    userId: string
    medicationId?: string
    defaultValues?: {
        name?: string
        form?: string
        doseAmount?: number
        doseUnit?: string
        frequency?: string
        frequencyInterval?: number
        frequencyDays?: number[]
        timesOfDay?: string[]
        specificTimes?: string[]
        currentStock?: number
        lowStockThreshold?: number
        instructions?: string
        startDate?: string
        endDate?: string
        expirationDate?: string
        notifyViaEmail?: boolean
        syncToCalendar?: boolean
    }
    onSuccess?: () => void
    onCancel?: () => void
    locale?: string
}

interface FormData {
    userId: string
    name: string
    form: string
    doseAmount: number
    doseUnit: string
    frequency: string
    frequencyInterval: number
    frequencyDays: number[]
    timesOfDay: string[]
    specificTimes: string[]
    currentStock: number
    lowStockThreshold: number
    instructions: string
    startDate: string
    endDate: string
    expirationDate: string
    notifyViaEmail: boolean
    syncToCalendar: boolean
}

const formOptions: Record<string, string> = {
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

const doseUnits = [
    { value: "mg", label: "mg" },
    { value: "ml", label: "ml" },
    { value: "mcg", label: "mcg" },
    { value: "g", label: "g" },
    { value: "tablet(s)", label: "Tableta(s)" },
    { value: "capsule(s)", label: "Cápsula(s)" },
    { value: "drop(s)", label: "Gota(s)" },
    { value: "puff(s)", label: "Puff(s)" },
    { value: "unit(s)", label: "Unidad(es)" }
]

const frequencies = [
    { value: "once_daily", label: "1 vez al día" },
    { value: "twice_daily", label: "2 veces al día" },
    { value: "three_times_daily", label: "3 veces al día" },
    { value: "four_times_daily", label: "4 veces al día" },
    { value: "every_x_hours", label: "Cada X horas" },
    { value: "as_needed", label: "Según necesidad" },
    { value: "weekly", label: "Semanal" },
    { value: "specific_days", label: "Días específicos" }
]

const weekDays = [
    { value: 0, label: "Dom", fullName: "Domingo" },
    { value: 1, label: "Lun", fullName: "Lunes" },
    { value: 2, label: "Mar", fullName: "Martes" },
    { value: 3, label: "Mié", fullName: "Miércoles" },
    { value: 4, label: "Jue", fullName: "Jueves" },
    { value: 5, label: "Vie", fullName: "Viernes" },
    { value: 6, label: "Sáb", fullName: "Sábado" }
]

const timesOfDayOptions = [
    { value: "morning", label: "Mañana (desayuno)" },
    { value: "afternoon", label: "Tarde (almuerzo)" },
    { value: "evening", label: "Atardecer" },
    { value: "night", label: "Noche (cena)" },
    { value: "fasting", label: "En ayunas" },
    { value: "with_meals", label: "Con las comidas" }
]

export function MedicationForm({ userId, medicationId, defaultValues, onSuccess, onCancel }: MedicationFormProps) {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [specificTimeInput, setSpecificTimeInput] = useState("")

    const form = useForm<FormData>({
        defaultValues: {
            userId: userId,
            name: defaultValues?.name || "",
            form: defaultValues?.form || "",
            doseAmount: defaultValues?.doseAmount ?? 1,
            doseUnit: defaultValues?.doseUnit || "",
            frequency: defaultValues?.frequency || "",
            frequencyInterval: defaultValues?.frequencyInterval ?? 8,
            frequencyDays: defaultValues?.frequencyDays || [],
            timesOfDay: defaultValues?.timesOfDay || [],
            specificTimes: defaultValues?.specificTimes || [],
            currentStock: defaultValues?.currentStock ?? 0,
            lowStockThreshold: defaultValues?.lowStockThreshold ?? 10,
            instructions: defaultValues?.instructions || "",
            startDate: defaultValues?.startDate || "",
            endDate: defaultValues?.endDate || "",
            expirationDate: defaultValues?.expirationDate || "",
            notifyViaEmail: defaultValues?.notifyViaEmail || false,
            syncToCalendar: defaultValues?.syncToCalendar || false,
        }
    })

    const selectedFrequency = form.watch("frequency")

    function addSpecificTime() {
        if (specificTimeInput) {
            const current = form.getValues("specificTimes") || []
            if (!current.includes(specificTimeInput)) {
                form.setValue("specificTimes", [...current, specificTimeInput])
            }
            setSpecificTimeInput("")
        }
    }

    function removeSpecificTime(time: string) {
        const current = form.getValues("specificTimes") || []
        form.setValue("specificTimes", current.filter(t => t !== time))
    }

    function toggleTimeOfDay(value: string) {
        const current = form.getValues("timesOfDay") || []
        if (current.includes(value)) {
            form.setValue("timesOfDay", current.filter(t => t !== value))
        } else {
            form.setValue("timesOfDay", [...current, value])
        }
    }

    function toggleWeekDay(value: number) {
        const current = form.getValues("frequencyDays") || []
        if (current.includes(value)) {
            form.setValue("frequencyDays", current.filter(d => d !== value))
        } else {
            form.setValue("frequencyDays", [...current, value])
        }
    }

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        setMessage(null)

        let hasErrors = false

        if (!data.name || data.name.trim() === "") {
            form.setError("name", { message: "El nombre del medicamento es requerido" })
            hasErrors = true
        }
        if (!data.form || data.form.trim() === "") {
            form.setError("form", { message: "La forma farmacéutica es requerida" })
            hasErrors = true
        }
        if (!data.doseUnit || data.doseUnit.trim() === "") {
            form.setError("doseUnit", { message: "La unidad de dosis es requerida" })
            hasErrors = true
        }
        if (!data.doseAmount || data.doseAmount <= 0) {
            form.setError("doseAmount", { message: "La dosis debe ser mayor a 0" })
            hasErrors = true
        }
        if (!data.frequency || data.frequency.trim() === "") {
            form.setError("frequency", { message: "La frecuencia es requerida" })
            hasErrors = true
        }
        if (!data.startDate || data.startDate.trim() === "") {
            form.setError("startDate", { message: "La fecha de inicio es requerida" })
            hasErrors = true
        }

        if (hasErrors) {
            setIsLoading(false)
            return
        }

        const planData: MedicationPlanInput = {
            userId: data.userId,
            name: data.name.trim(),
            form: data.form as MedicationPlanInput["form"],
            doseAmount: data.doseAmount,
            doseUnit: data.doseUnit as MedicationPlanInput["doseUnit"],
            frequency: data.frequency as MedicationPlanInput["frequency"],
            frequencyInterval: data.frequency === "every_x_hours" ? data.frequencyInterval : undefined,
            frequencyDays: data.frequency === "specific_days" && data.frequencyDays && data.frequencyDays.length > 0 ? data.frequencyDays : undefined,
            timesOfDay: data.timesOfDay && data.timesOfDay.length > 0 ? data.timesOfDay as MedicationPlanInput["timesOfDay"] : undefined,
            specificTimes: data.specificTimes && data.specificTimes.length > 0 ? data.specificTimes : undefined,
            currentStock: data.currentStock,
            lowStockThreshold: data.lowStockThreshold,
            instructions: data.instructions || undefined,
            startDate: data.startDate,
            endDate: data.endDate || undefined,
            expirationDate: data.expirationDate || undefined,
            notifyViaEmail: data.notifyViaEmail,
            syncToCalendar: data.syncToCalendar,
            isActive: true,
        }

        try {
            const result = medicationId 
                ? await updateMedicationPlan(medicationId, planData)
                : await createMedicationPlan(planData, data.userId)

            if (result.success) {
                setMessage({ type: "success", text: medicationId ? "Medicamento actualizado" : "Medicamento agregado" })
                setTimeout(() => {
                    onSuccess?.()
                }, 1000)
            } else {
                setMessage({ type: "error", text: result.error || "Error al guardar" })
            }
        } catch {
            setMessage({ type: "error", text: "Error inesperado" })
        } finally {
            setIsLoading(false)
        }
    }

    const isEditing = !!medicationId

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                    {isEditing ? "Editar Medicamento" : "Agregar Medicamento"}
                </h2>
                {onCancel && (
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="size-4" />
                    </Button>
                )}
            </div>

            {message && (
                <Alert className={`mb-6 ${message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                        {message.text}
                    </AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Package className="w-4 h-4" />
                            <span className="text-xs font-medium">Información del medicamento</span>
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Nombre del medicamento *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Ej. Paracetamol 500mg" className="h-12 bg-white rounded-md text-sm border-slate-200" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="form"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-900">Forma farmacéutica *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full h-12 bg-white rounded-md text-sm border-slate-200">
                                                    <SelectValue placeholder="Selecciona" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(formOptions).map(([value, label]) => (
                                                    <SelectItem key={value} value={value} className="rounded-lg">{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="doseUnit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-900">Unidad de dosis *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full h-12 bg-white rounded-md text-sm border-slate-200">
                                                    <SelectValue placeholder="Selecciona" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {doseUnits.map(unit => (
                                                    <SelectItem key={unit.value} value={unit.value} className="rounded-lg">{unit.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="doseAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Dosis por toma *</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            step="0.1" 
                                            min="0"
                                            value={field.value} 
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value)
                                                field.onChange(isNaN(val) ? 1 : val)
                                            }}
                                            className="h-12 bg-white rounded-md text-sm border-slate-200" 
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium">Horario del tratamiento</span>
                        </div>
                        <p className="text-xs text-slate-400">Define cuándo y con qué frecuencia tomarás el medicamento</p>

                        <FormField
                            control={form.control}
                            name="frequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Frecuencia *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full h-12 bg-white rounded-md text-sm border-slate-200">
                                                <SelectValue placeholder="Selecciona" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {frequencies.map(freq => (
                                                <SelectItem key={freq.value} value={freq.value} className="rounded-lg">{freq.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {selectedFrequency === "every_x_hours" && (
                            <FormField
                                control={form.control}
                                name="frequencyInterval"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-900">Intervalo (horas)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min="1"
                                                max="24"
                                                value={field.value} 
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 8)}
                                                className="h-12 bg-white rounded-md text-sm border-slate-200" 
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        )}

                        {selectedFrequency === "specific_days" && (
                            <div>
                                <FormLabel className="text-sm font-bold text-slate-900">Días de la semana</FormLabel>
                                <p className="text-xs text-slate-400 mb-2">Selecciona los días en que tomarás el medicamento</p>
                                <div className="flex flex-wrap gap-2">
                                    {weekDays.map(day => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleWeekDay(day.value)}
                                            className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                                                (form.watch("frequencyDays") || []).includes(day.value)
                                                    ? "bg-primary border-primary text-white"
                                                    : "bg-white border-slate-200 text-slate-700 hover:border-primary"
                                            }`}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <FormLabel className="text-sm font-bold text-slate-900">Momentos del día</FormLabel>
                            <p className="text-xs text-slate-400 mb-2">Selecciona los momentos en que tomarás el medicamento</p>
                            <div className="flex flex-wrap gap-2">
                                {timesOfDayOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                                            (form.watch("timesOfDay") || []).includes(option.value)
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-white border-slate-200 text-slate-700"
                                        }`}
                                    >
                                        <Checkbox
                                            checked={(form.watch("timesOfDay") || []).includes(option.value)}
                                            onCheckedChange={() => toggleTimeOfDay(option.value)}
                                            className="size-4"
                                        />
                                        <span className="text-sm">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <FormLabel className="text-sm font-bold text-slate-900">Horarios específicos</FormLabel>
                            <p className="text-xs text-slate-400 mb-2">Agrega horas específicas (ej. 08:00, 14:00, 20:00)</p>
                            <div className="flex gap-2">
                                <Input 
                                    type="time" 
                                    value={specificTimeInput}
                                    onChange={(e) => setSpecificTimeInput(e.target.value)}
                                    className="h-12 bg-white rounded-md text-sm border-slate-200"
                                />
                                <Button type="button" onClick={addSpecificTime} variant="outline" className="h-12">
                                    Agregar
                                </Button>
                            </div>
                            {(form.watch("specificTimes") || []).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(form.watch("specificTimes") || []).map(time => (
                                        <span key={time} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md text-sm">
                                            {time}
                                            <button type="button" onClick={() => removeSpecificTime(time)} className="text-slate-400 hover:text-red-500">
                                                <X className="size-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium">Fechas del tratamiento</span>
                        </div>
                        <p className="text-xs text-slate-400">Define cuándo comienza y termina el tratamiento</p>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-900">Fecha de inicio *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="h-12 bg-white rounded-md text-sm border-slate-200" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-900">Fecha de fin (opcional)</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="h-12 bg-white rounded-md text-sm border-slate-200" />
                                        </FormControl>
                                        <p className="text-xs text-slate-400">Dejar vacío si es continuo</p>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Package className="w-4 h-4" />
                            <span className="text-xs font-medium">Inventario</span>
                        </div>
                        <p className="text-xs text-slate-400">Gestiona el stock del medicamento</p>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="currentStock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-900">Stock actual</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min="0"
                                                value={field.value} 
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                className="h-12 bg-white rounded-md text-sm border-slate-200" 
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lowStockThreshold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-slate-900">Alerta de stock bajo</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min="0"
                                                value={field.value} 
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                className="h-12 bg-white rounded-md text-sm border-slate-200" 
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="expirationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Fecha de vencimiento del medicamento</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="h-12 bg-white rounded-md text-sm border-slate-200" />
                                    </FormControl>
                                    <p className="text-xs text-slate-400">Fecha de caducidad del medicamento físico</p>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-bold text-slate-900">Instrucciones adicionales</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Ej. Tomar con agua después de comer, evitar alimentos grasos" className="min-h-20 bg-white rounded-md text-sm border-slate-200 resize-none" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <FormField
                            name="notifyViaEmail"
                            render={() => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={form.watch("notifyViaEmail")}
                                            onCheckedChange={(checked) => form.setValue("notifyViaEmail", checked === true)}
                                            className="size-5 rounded-md"
                                        />
                                    </FormControl>
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-4 text-slate-500" />
                                        <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">Recibir recordatorios por email</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="syncToCalendar"
                            render={() => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={form.watch("syncToCalendar")}
                                            onCheckedChange={(checked) => form.setValue("syncToCalendar", checked === true)}
                                            className="size-5 rounded-md"
                                        />
                                    </FormControl>
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="size-4 text-slate-500" />
                                        <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">Sincronizar con calendario</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        {onCancel && (
                            <Button type="button" variant="outline" className="flex-1 h-12" onClick={onCancel}>Cancelar</Button>
                        )}
                        <Button type="submit" className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white" disabled={isLoading}>
                            {isLoading ? "Guardando..." : medicationId ? "Actualizar" : "Agregar"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
