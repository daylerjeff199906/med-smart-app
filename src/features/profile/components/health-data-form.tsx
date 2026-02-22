"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { healthDataSchema, type HealthDataInput } from "../types/profile"
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
import { updateHealthDataAction } from "../actions/profile-actions"
import { Eye, EyeOff, ShieldAlert, HeartPulse } from "lucide-react"

interface HealthDataFormProps {
    defaultValues: HealthDataInput
    locale?: string
}

export function HealthDataForm({ defaultValues, locale = "es" }: HealthDataFormProps) {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [isSensitiveDataVisible, setIsSensitiveDataVisible] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)

    const form = useForm<HealthDataInput>({
        resolver: zodResolver(healthDataSchema),
        defaultValues,
    })

    async function onSubmit(data: HealthDataInput) {
        setMessage(null)

        if (!acceptedTerms) {
            setMessage({ type: "error", text: "Debes aceptar el tratamiento de tus datos de salud para continuar." })
            return
        }

        try {
            const result = await updateHealthDataAction(data, locale)

            if (result.success) {
                setMessage({ type: "success", text: "Datos médicos actualizados correctamente" })
            } else {
                setMessage({ type: "error", text: result.error || "Error al actualizar datos médicos" })
            }
        } catch {
            setMessage({ type: "error", text: "Error inesperado al actualizar datos médicos" })
        }
    }

    const sensitiveFields = ["weight", "height", "allergies", "chronicConditions", "hasDiabetes", "hasHypertension"] as const
    const isFieldHidden = (fieldName: string) => !isSensitiveDataVisible && sensitiveFields.includes(fieldName as typeof sensitiveFields[number])

    const renderObfuscatedValue = () => {
        return (
            <div className="h-12 bg-slate-100 rounded-md border border-slate-200 flex items-center px-4">
                <span className="text-slate-400 text-sm">••••••</span>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-6 lg:py-10">
            {message && (
                <Alert className={`mb-6 ${message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                        {message.text}
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Datos Médicos</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona tu información de salud y biometría.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSensitiveDataVisible(!isSensitiveDataVisible)}
                        className={`h-10 px-4 rounded-md font-medium text-xs uppercase tracking-wider gap-2 ${isSensitiveDataVisible ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" : ""}`}
                    >
                        {isSensitiveDataVisible ? (
                            <>
                                <EyeOff className="size-4" />
                                Ocultar datos sensibles
                            </>
                        ) : (
                            <>
                                <Eye className="size-4" />
                                Mostrar datos sensibles
                            </>
                        )}
                    </Button>
                    <Button variant="outline" className="h-10 px-6 rounded-md font-medium text-xs uppercase tracking-wider" type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="h-10 px-6 rounded-md font-medium text-xs bg-slate-900 hover:bg-slate-800 text-white uppercase tracking-wider active:scale-95 transition-all"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Guardando..." : "Actualizar"}
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form className="space-y-0">
                    {/* Weight & Height */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900">Biometría</FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Tu peso y altura (vital para calcular las dosis exactas de tus pastillas).</p>
                        </div>
                        <div className="md:col-span-8 grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Peso (kg)</FormLabel>
                                        <FormControl>
                                            {isFieldHidden("weight") ? (
                                                renderObfuscatedValue()
                                            ) : (
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="70"
                                                    className="h-12 bg-white rounded-md text-sm border-slate-200"
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        field.onChange(value === "" ? undefined : parseFloat(value))
                                                    }}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Altura (cm)</FormLabel>
                                        <FormControl>
                                            {isFieldHidden("height") ? (
                                                renderObfuscatedValue()
                                            ) : (
                                                <Input
                                                    type="number"
                                                    step="1"
                                                    placeholder="170"
                                                    className="h-12 bg-white rounded-md text-sm border-slate-200"
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        field.onChange(value === "" ? undefined : parseFloat(value))
                                                    }}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Blood Type */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900">Grupo Sanguíneo</FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Información crítica para emergencias.</p>
                        </div>
                        <div className="md:col-span-8">
                            <FormField
                                control={form.control}
                                name="bloodType"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 bg-white rounded-md text-sm border-slate-200">
                                                    <SelectValue placeholder="Selecciona tu grupo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"].map(t => (
                                                    <SelectItem key={t} value={t} className="rounded-lg py-3">
                                                        {t === "unknown" ? "No sé" : t}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Conditions & Allergies */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900">Historial Clínico</FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Detalla tus alergias o condiciones crónicas.</p>
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-700">Alergias</FormLabel>
                                        <FormControl>
                                            {isFieldHidden("allergies") ? (
                                                renderObfuscatedValue()
                                            ) : (
                                                <Textarea {...field} placeholder="Lista tus alergias..." className="min-h-[100px] bg-white rounded-md text-sm border-slate-200 resize-none" />
                                            )}
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chronicConditions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-700">Condiciones Crónicas</FormLabel>
                                        <FormControl>
                                            {isFieldHidden("chronicConditions") ? (
                                                renderObfuscatedValue()
                                            ) : (
                                                <Textarea {...field} placeholder="Otras condiciones crónicas..." className="min-h-[100px] bg-white rounded-md text-sm border-slate-200 resize-none" />
                                            )}
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Boolean Flags */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900">Condiciones Críticas</FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Marca si padeces alguna de estas condiciones.</p>
                        </div>
                        <div className="md:col-span-8 flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="hasDiabetes"
                                render={({ field }) => (
                                    <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-slate-100 p-4 ${isFieldHidden("hasDiabetes") ? "bg-slate-50/30" : "bg-slate-50/50 hover:bg-slate-50"} transition-colors`}>
                                        <FormControl>
                                            {isFieldHidden("hasDiabetes") ? (
                                                <div className="size-5 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center">
                                                    <span className="text-slate-400 text-xs">••</span>
                                                </div>
                                            ) : (
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="size-5 rounded-md"
                                                />
                                            )}
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-bold text-slate-800">Diabetes</FormLabel>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">¿Padeces o has sido diagnosticado con diabetes?</p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hasHypertension"
                                render={({ field }) => (
                                    <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-slate-100 p-4 ${isFieldHidden("hasHypertension") ? "bg-slate-50/30" : "bg-slate-50/50 hover:bg-slate-50"} transition-colors`}>
                                        <FormControl>
                                            {isFieldHidden("hasHypertension") ? (
                                                <div className="size-5 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center">
                                                    <span className="text-slate-400 text-xs">••</span>
                                                </div>
                                            ) : (
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="size-5 rounded-md"
                                                />
                                            )}
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-bold text-slate-800">Hipertensión</FormLabel>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">¿Padeces o has sido diagnosticado con hipertensión arterial?</p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Terms and Disclaimer */}
                    <div className="py-8">
                        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                            <FormField
                                name="acceptedTerms"
                                render={() => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={acceptedTerms}
                                                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                                                className="mt-1 size-5 rounded-md"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-medium text-slate-800 cursor-pointer">
                                                Acepto el tratamiento de mis datos de salud (datos sensibles) para personalizar mi experiencia médica en Bequi.
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
                                <HeartPulse className="size-4 text-slate-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-slate-400">
                                    Nota: Bequi es una herramienta de gestión y no reemplaza el consejo, diagnóstico o tratamiento de un médico profesional.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
