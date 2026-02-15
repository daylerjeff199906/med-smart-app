"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { emergencyContactsListSchema, type EmergencyContactsListInput } from "../types/profile"
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
import { Plus, Trash2, ShieldAlert } from "lucide-react"

export function EmergencyContactsForm({ defaultValues }: { defaultValues: EmergencyContactsListInput }) {
    const form = useForm<EmergencyContactsListInput>({
        resolver: zodResolver(emergencyContactsListSchema),
        defaultValues,
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "contacts",
    })

    async function onSubmit(data: EmergencyContactsListInput) {
        try {
            console.log("Saving emergency contacts:", data)
            alert("Contactos de emergencia actualizados")
        } catch (error) {
            alert("Error al actualizar los contactos")
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="flex items-center justify-between mb-10 pb-6 border-b">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Contactos de Emergencia</h1>
                    <p className="text-sm text-slate-500 mt-1">Personas a las que contactar en caso de una emergencia médica.</p>
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
                <form className="space-y-6">
                    {fields.length === 0 && (
                        <div className="bg-slate-50 rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200">
                            <ShieldAlert className="size-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="font-bold text-slate-800">No hay contactos registrados</h3>
                            <p className="text-xs text-slate-500 mt-1 mb-6">Añade al menos un contacto para casos de emergencia.</p>
                            <Button
                                type="button"
                                onClick={() => append({ contactName: "", phoneNumber: "", relationship: "", priorityOrder: fields.length + 1 })}
                                className="h-10 rounded-xl bg-slate-900 border-none px-6"
                            >
                                Añadir Primer Contacto
                            </Button>
                        </div>
                    )}

                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative group animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="size-10 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="col-span-2 flex items-center gap-3 mb-2">
                                        <div className="size-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold leading-none">
                                            {index + 1}
                                        </div>
                                        <h3 className="font-bold text-slate-800">Contacto {index + 1}</h3>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`contacts.${index}.contactName`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nombre Completo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="P. ej. María García" className="h-12 bg-white rounded-md text-sm border-slate-200" />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`contacts.${index}.phoneNumber`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Teléfono</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="+51 123 456 789" className="h-12 bg-white rounded-md text-sm border-slate-200" />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`contacts.${index}.relationship`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Parentesco / Relación</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="P. ej. Madre, Hermano, Cónyuge..." className="h-12 bg-white rounded-md text-sm border-slate-200" />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {fields.length > 0 && (
                        <div className="flex justify-center pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ contactName: "", phoneNumber: "", relationship: "", priorityOrder: fields.length + 1 })}
                                className="h-12 rounded-2xl px-8 border-dashed border-2 hover:bg-slate-50 transition-all font-bold text-slate-600 flex gap-2"
                            >
                                <Plus className="size-4" /> Añadir otro contacto
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    )
}
