"use client"

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

export function HealthDataForm({ defaultValues }: { defaultValues: HealthDataInput }) {
    const form = useForm<HealthDataInput>({
        resolver: zodResolver(healthDataSchema),
        defaultValues,
    })

    async function onSubmit(data: HealthDataInput) {
        try {
            console.log("Saving health data:", data)
            alert("Datos de salud actualizados")
        } catch (error) {
            alert("Error al actualizar los datos de salud")
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="flex items-center justify-between mb-10 pb-6 border-b">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Datos Médicos</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona tu información de salud y biometría.</p>
                </div>
                <div className="flex gap-3">
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
                            <p className="text-xs text-slate-500 mt-1 pr-4">Tu peso (kg) y altura (cm) para cálculos médicos.</p>
                        </div>
                        <div className="md:col-span-8 grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Peso (kg)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="70" className="h-12 bg-white rounded-md text-sm border-slate-200" />
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
                                            <Input {...field} placeholder="170" className="h-12 bg-white rounded-md text-sm border-slate-200" />
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
                                                    <SelectItem key={t} value={t} className="rounded-lg py-3">{t}</SelectItem>
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
                                            <Textarea {...field} placeholder="Lista tus alergias..." className="min-h-[100px] bg-white rounded-md text-sm border-slate-200 resize-none" />
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
                                            <Textarea {...field} placeholder="Otras condiciones crónicas..." className="min-h-[100px] bg-white rounded-md text-sm border-slate-200 resize-none" />
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
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-slate-100 p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="size-5 rounded-md"
                                            />
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
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-slate-100 p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="size-5 rounded-md"
                                            />
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
                </form>
            </Form>
        </div>
    )
}
