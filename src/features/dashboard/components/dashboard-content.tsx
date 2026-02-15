"use client"

import { Plus, ClipboardList, Microscope, Pill, Bell, ChevronRight, Activity } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardContentProps {
    profile: any;
    locale: string;
}

export function DashboardContent({ profile, locale }: DashboardContentProps) {
    const name = profile?.first_name || "Usuario";
    const healthData = profile?.health_data;

    // Fecha actual formateada
    const today = new Date();
    const formattedDate = today.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 max-w-[1600px] mx-auto">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-6">
                {/* Header Greeting */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        ¡Hola, {name}!
                    </h1>
                    <p className="text-sm text-slate-500 font-medium capitalize">
                        {formattedDate}
                    </p>
                </div>

                {/* Featured Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Welcome Background Card */}
                    <div className="bg-[#60A5FA] rounded-[40px] p-8 text-white relative overflow-hidden min-h-[220px] shadow-lg shadow-blue-200/50">
                        <div className="relative z-10 space-y-4 max-w-[200px]">
                            <h2 className="text-2xl font-bold leading-tight">Bienvenido de vuelta...</h2>
                            <p className="text-xs opacity-90 leading-relaxed font-medium">
                                Esperamos que estés bien. ¿En qué podemos ayudarte hoy?
                            </p>
                            <div className="pt-2">
                                <button className="bg-white/20 hover:bg-white/30 p-2.5 rounded-2xl transition-all border border-white/20 backdrop-blur-sm group">
                                    <Plus className="size-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>
                        {/* Abstract decoration - Circle/Orb instead of image to avoid missing assets */}
                        <div className="absolute -right-10 -bottom-10 size-64 bg-blue-400/30 rounded-full blur-3xl" />
                        <div className="absolute right-0 bottom-0 p-4 opacity-20">
                            <Activity className="size-32" />
                        </div>
                    </div>

                    {/* Latest Results Card */}
                    <div className="bg-[#93C5FD] rounded-[40px] p-8 text-white min-h-[220px] shadow-lg shadow-blue-100/50 border border-blue-300/20">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            Últimos resultados
                        </h2>
                        <div className="space-y-5">
                            {[
                                { label: 'Glucosa', value: 82, unit: 'mg', color: 'bg-white' },
                                { label: 'BUN', value: 10, unit: 'mg/dL', color: 'bg-white/60' },
                                { label: 'AST', value: 45, unit: 'U/L', color: 'bg-white/30' }
                            ].map((res, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-90">
                                        <span>{res.label}</span>
                                        <span>{res.value} {res.unit}</span>
                                    </div>
                                    <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                                        <div className={`h-full ${res.color} rounded-full transition-all duration-1000`} style={{ width: `${res.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: ClipboardList, label: 'Diagnósticos', sub: 'Lista de condiciones', color: 'bg-teal-50 text-teal-600', border: 'border-teal-100' },
                        { icon: Microscope, label: 'Exámenes', sub: 'Archivo de pruebas', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
                        { icon: Pill, label: 'Medicamentos', sub: 'Recetas activas', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' }
                    ].map((action, i) => (
                        <div key={i} className={`bg-white rounded-[32px] p-6 shadow-sm border ${action.border} flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group`}>
                            <div className={`p-4 rounded-[20px] ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                                <action.icon className="size-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-sm">{action.label}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{action.sub}</p>
                            </div>
                            <Plus className="size-4 text-slate-300 group-hover:text-slate-500" />
                        </div>
                    ))}
                </div>

                {/* Calendar Section */}
                <div className="bg-white rounded-[48px] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Septiembre</h2>
                        <div className="flex gap-2">
                            <button className="h-10 px-4 rounded-2xl border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-all text-slate-600">Anterior</button>
                            <button className="h-10 px-4 rounded-2xl border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-all text-slate-600">Siguiente</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-6 text-center">
                        {['lu', 'ma', 'mi', 'ju', 'vi', 'sa', 'do'].map(day => (
                            <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{day}</div>
                        ))}
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} className={`relative h-14 flex items-center justify-center text-sm font-bold rounded-[20px] cursor-pointer transition-all ${i + 1 === 21 ? 'bg-teal-50 text-teal-600 ring-2 ring-teal-100' : 'text-slate-800 hover:bg-slate-50'}`}>
                                {i + 1}
                                {i + 1 === 7 && <div className="absolute top-3 right-4 size-2 bg-orange-400 rounded-full border-2 border-white" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar Area */}
            <div className="lg:col-span-4 space-y-6">
                {/* Identity Summary Card */}
                <div className="bg-white rounded-[48px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <Avatar className="size-28 border-4 border-white shadow-2xl">
                            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                            <AvatarFallback className="bg-slate-100 text-slate-500 font-extrabold text-3xl">
                                {name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-1 right-1 size-7 bg-green-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                            <div className="size-2 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
                        {name} {profile?.last_name?.[0] || ''}.
                    </h2>
                    <p className="text-xs text-slate-400 font-bold tracking-wide overflow-hidden text-ellipsis w-full px-4 mb-8">
                        {profile?.email}
                    </p>

                    <div className="grid grid-cols-3 w-full gap-4 pt-8 border-t border-slate-100">
                        <div className="text-center space-y-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sangre</p>
                            <p className="text-sm font-extrabold text-slate-900">{healthData?.blood_type || '--'}</p>
                        </div>
                        <div className="text-center space-y-1 border-x border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Peso</p>
                            <p className="text-sm font-extrabold text-slate-900">{healthData?.weight ? `${healthData.weight}kg` : '--'}</p>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Talla</p>
                            <p className="text-sm font-extrabold text-slate-900">{healthData?.height ? `${healthData.height}cm` : '--'}</p>
                        </div>
                    </div>
                </div>

                {/* Results Snippet Card */}
                <div className="bg-white rounded-[48px] p-8 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-sm">Resumen médico</h3>
                        <Plus className="size-4 text-slate-300 hover:text-slate-900 cursor-pointer" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Tu ritmo cardíaco promedio se mantiene en 72 bpm, dentro del rango normal (60-100 beats por minuto) para adultos sanos en reposo...
                    </p>
                    <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 group">
                        VER DETALLES <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Reminders List Card */}
                <div className="bg-white rounded-[48px] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-extrabold text-slate-900 text-sm">Recordatorios</h3>
                        <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center">
                            <Bell className="size-4 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { title: 'Cita - Dr. Rogan', date: 'Mañana, 10:30 AM', color: 'bg-rose-50 text-rose-500', icon: Bell },
                            { title: 'Medicina - Vitamina D', date: 'En 2 horas', color: 'bg-blue-50 text-blue-500', icon: Pill },
                            { title: 'Análisis - Ayunas', date: 'Jueves, 07:00 AM', color: 'bg-teal-50 text-teal-500', icon: Activity }
                        ].map((rem, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                <div className={`size-14 rounded-[20px] flex items-center justify-center ${rem.color} group-hover:scale-110 transition-all duration-300 shadow-sm border border-black/5`}>
                                    <rem.icon className="size-6" />
                                </div>
                                <div className="overflow-hidden space-y-1">
                                    <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{rem.title}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{rem.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
