"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { medicationPlanSchema, type MedicationPlanInput } from "../types/medication"
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
import { 
    Pill, 
    Plus, 
    Calendar, 
    Clock, 
    AlertTriangle, 
    Mail, 
    CalendarDays,
    X
} from "lucide-react"
import { createMedicationPlan, updateMedicationPlan, deleteMedicationPlan } from "../actions/medication-actions"

interface MedicationFormProps {
    defaultValues?: Partial<MedicationPlanInput>
    onSuccess?: () => void
    onCancel?: () => void
    locale?: string
}

const formOptions = {
    tablet: "Tablet",
    capsule: "Capsule", 
    liquid: "Liquid",
    injection: "Injection",
    inhaler: "Inhaler",
    cream: "Cream",
    drops: "Drops",
    patch: "Patch",
    suppository: "Suppository",
    other: "Other"
}

const doseUnits = [
    { value: "mg", label: "mg" },
    { value: "ml", label: "ml" },
    { value: "mcg", label: "mcg" },
    { value: "g", label: "g" },
    { value: "tablet(s)", label: "Tablet(s)" },
    { value: "capsule(s)", label: "Capsule(s)" },
    { value: "drop(s)", label: "Drop(s)" },
    { value: "puff(s)", label: "Puff(s)" },
    { value: "unit(s)", label: "Unit(s)" }
]

const frequencies = [
    { value: "once_daily", label: "Once daily" },
    { value: "twice_daily", label: "Twice daily" },
    { value: "three_times_daily", label: "Three times daily" },
    { value: "four_times_daily", label: "Four times daily" },
    { value: "every_x_hours", label: "Every X hours" },
    { value: "as_needed", label: "As needed" },
    { value: "weekly", label: "Weekly" },
    { value: "specific_days", label: "Specific days" }
]

const timesOfDay = [
    { value: "morning", label: "Morning", icon: "🌅" },
    { value: "afternoon", label: "Afternoon", icon: "☀️" },
    { value: "evening", label: "Evening", icon: "🌆" },
    { value: "night", label: "Night", icon: "🌙" },
    { value: "with_meals", label: "With meals", icon: "🍽️" },
    { value: "fasting", label: "Fasting", icon: "💧" }
]

export function MedicationForm({ defaultValues, onSuccess, onCancel, locale = "es" }: MedicationFormProps) {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<MedicationPlanInput>({
        resolver: zodResolver(medicationPlanSchema),
        defaultValues: {
            userId: "",
            name: "",
            form: "tablet",
            doseAmount: 0,
            doseUnit: "mg",
            frequency: "once_daily",
            currentStock: 0,
            lowStockThreshold: 10,
            isActive: true,
            notifyViaEmail: false,
            syncToCalendar: false,
            startDate: new Date().toISOString().split("T")[0],
            ...defaultValues
        }
    })

    async function onSubmit(data: MedicationPlanInput) {
        setIsLoading(true)
        setMessage(null)

        try {
            const result = defaultValues?.id 
                ? await updateMedicationPlan(defaultValues.id, data)
                : await createMedicationPlan(data, data.userId)

            if (result.success) {
                setMessage({ type: "success", text: defaultValues?.id ? "Medicamento actualizado" : "Medicamento agregado" })
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

    const isEditing = !!defaultValues?.id

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-bold text-slate-900">Nombre del medicamento</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        placeholder="Ej. Paracetamol" 
                                        className="h-12 bg-white rounded-md text-sm border-slate-200" 
                                    />
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
                                    <FormLabel className="text-sm font-bold text-slate-900">Forma</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 bg-white rounded-md text-sm border-slate-200">
                                                <SelectValue placeholder="Selecciona" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(formOptions).map(([value, label]) => (
                                                <SelectItem key={value} value={value} className="rounded-lg">
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="frequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Frecuencia</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 bg-white rounded-md text-sm border-slate-200">
                                                <SelectValue placeholder="Selecciona" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {frequencies.map(freq => (
                                                <SelectItem key={freq.value} value={freq.value} className="rounded-lg">
                                                    {freq.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="doseAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Dosis</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                            className="h-12 bg-white rounded-md text-sm border-slate-200"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="doseUnit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Unidad</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 bg-white rounded-md text-sm border-slate-200">
                                                <SelectValue placeholder="Selecciona" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {doseUnits.map(unit => (
                                                <SelectItem key={unit.value} value={unit.value} className="rounded-lg">
                                                    {unit.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

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
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
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
                                    <FormLabel className="text-sm font-bold text-slate-900">Umbral bajo</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
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
                        name="instructions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-bold text-slate-900">Instrucciones</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        {...field} 
                                        placeholder="Ej. Tomar con agua después de comer" 
                                        className="min-h-[80px] bg-white rounded-md text-sm border-slate-200 resize-none" 
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Fecha inicio</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            className="h-12 bg-white rounded-md text-sm border-slate-200"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="expirationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-slate-900">Fecha caducidad</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            value={field.value || ""}
                                            className="h-12 bg-white rounded-md text-sm border-slate-200"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

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
                                        <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">
                                            Notificar por email (Resend)
                                        </FormLabel>
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
                                        <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">
                                            Sincronizar con calendario
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        {onCancel && (
                            <Button type="button" variant="outline" className="flex-1 h-12" onClick={onCancel}>
                                Cancelar
                            </Button>
                        )}
                        <Button 
                            type="submit" 
                            className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Guardando..." : defaultValues?.id ? "Actualizar" : "Agregar"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
