"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileInput } from "../types/profile"
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
import { useTranslation } from "@/hooks/use-translation"

export function ProfileForm({ defaultValues }: { defaultValues: ProfileInput }) {
    const form = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    })

    async function onSubmit(data: ProfileInput) {
        try {
            // Logic to update profile would go here
            console.log("Saving profile:", data)
            alert("Perfil actualizado")
        } catch (error) {
            alert("Error al actualizar el perfil")
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="flex items-center justify-between mb-10 pb-6 border-b">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Configuración general</h1>
                    <p className="text-sm text-slate-500 mt-1">Configura los ajustes generales de tu cuenta.</p>
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
                    {/* First Name */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900">Nombres</FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Tu nombre será visible en la plataforma y recetas médicas.</p>
                        </div>
                        <div className="md:col-span-8">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} className="h-12 bg-white rounded-md text-sm border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-400" />
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900">Apellidos</FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Escribe tus apellidos completos.</p>
                        </div>
                        <div className="md:col-span-8">
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} className="h-12 bg-white rounded-md text-sm border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-400" />
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                Email
                                <span className="bg-slate-100 text-slate-500 font-normal py-0.5 px-1.5 rounded text-[10px] uppercase border border-slate-200">Solo lectura</span>
                            </FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Tu dirección de correo electrónico vinculada a la cuenta.</p>
                        </div>
                        <div className="md:col-span-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} disabled className="h-12 bg-slate-50 text-slate-500 rounded-md text-sm border-slate-200 cursor-not-allowed opacity-70" />
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900">Género</FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Selecciona tu género para personalizar tu experiencia médica.</p>
                        </div>
                        <div className="md:col-span-8">
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 bg-white rounded-md text-sm border-slate-200">
                                                    <SelectValue placeholder="Selecciona tu género" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                <SelectItem value="male" className="rounded-lg py-3">Masculino</SelectItem>
                                                <SelectItem value="female" className="rounded-lg py-3">Femenino</SelectItem>
                                                <SelectItem value="other" className="rounded-lg py-3">Otro</SelectItem>
                                                <SelectItem value="prefer_not_to_say" className="rounded-lg py-3">Prefiero no decir</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Accent Color Display (Design only) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-b items-start">
                        <div className="md:col-span-4">
                            <FormLabel className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                Color de acento
                                <span className="bg-indigo-100 text-indigo-600 font-bold py-0.5 px-1.5 rounded text-[10px] uppercase border border-indigo-200">Pro</span>
                            </FormLabel>
                            <p className="text-xs text-slate-500 mt-1 pr-4">Personaliza los colores de tu dashboard.</p>
                        </div>
                        <div className="md:col-span-8">
                            <div className="flex flex-wrap gap-2.5">
                                {[
                                    'bg-slate-900 ring-2 ring-offset-2 ring-slate-400',
                                    'bg-orange-500',
                                    'bg-pink-500',
                                    'bg-green-500',
                                    'bg-blue-500',
                                    'bg-purple-500'
                                ].map((c, i) => (
                                    <div key={i} className={`size-8 rounded-full ${c} cursor-pointer hover:scale-110 transition-all border border-black/5`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
