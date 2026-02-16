"use client"

import * as React from "react"
import { User, ShieldAlert, HeartPulse, ChevronRight, Settings, CreditCard, Bell, ShieldCheck } from "lucide-react"
import { ProfileForm } from "./profile-form"
import { HealthDataForm } from "./health-data-form"
import { EmergencyContactsForm } from "./emergency-contacts-form"
import { type ProfileInput, type HealthDataInput, type EmergencyContactsListInput } from "../types/profile"

interface ProfileSettingsProps {
    initialData: {
        profile: ProfileInput;
        health: HealthDataInput;
        emergency: EmergencyContactsListInput;
    }
}

type TabId = 'profile' | 'health' | 'emergency' | 'billing' | 'notifications' | 'security';

export function ProfileSettings({ initialData }: ProfileSettingsProps) {
    const [activeTab, setActiveTab] = React.useState<TabId>('profile')

    const menuItems = [
        { id: 'profile', label: 'Mi Perfil', icon: User, description: 'Información personal y cuenta' },
        { id: 'health', label: 'Datos Médicos', icon: HeartPulse, description: 'Biometría e historial' },
        { id: 'emergency', label: 'Contactos', icon: ShieldAlert, description: 'En caso de emergencia' },
    ] as const;

    const secondaryMenuItems = [
        { id: 'security', label: 'Seguridad', icon: ShieldCheck, description: 'Contraseña y accesos' },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, description: 'Preferencias de avisos' },
        { id: 'billing', label: 'Facturación', icon: CreditCard, description: 'Planes y pagos' },
    ] as const;

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileForm defaultValues={initialData.profile} />
            case 'health':
                return <HealthDataForm defaultValues={initialData.health} />
            case 'emergency':
                return <EmergencyContactsForm defaultValues={initialData.emergency} />
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                        <Settings className="size-16 text-slate-200 mb-4 animate-spin-slow" />
                        <h2 className="text-xl font-bold text-slate-800">Sección en construcción</h2>
                        <p className="text-sm text-slate-500 mt-2">Estamos trabajando para habilitar esta sección muy pronto.</p>
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white max-w-[1600px] mx-auto overflow-hidden">
            {/* Settings Sidebar */}
            <aside className="w-full lg:w-[350px] border-r border-slate-100 p-8 flex flex-col gap-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight px-4">Configuración</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 px-4 italic">MedMind Settings</p>
                </div>

                <nav className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">General</p>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-4 p-4 rounded-[24px] transition-all group ${activeTab === item.id
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-colors ${activeTab === item.id ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-white'
                                }`}>
                                <item.icon className="size-5" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-bold leading-none">{item.label}</p>
                                <p className={`text-[10px] mt-1 font-medium ${activeTab === item.id ? 'text-white/60' : 'text-slate-400'
                                    }`}>
                                    {item.description}
                                </p>
                            </div>
                            <ChevronRight className={`size-4 transition-transform ${activeTab === item.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
                                }`} />
                        </button>
                    ))}
                </nav>

                <nav className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">Avanzado</p>
                    {secondaryMenuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-4 p-4 rounded-[24px] transition-all group ${activeTab === item.id
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-colors ${activeTab === item.id ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-white'
                                }`}>
                                <item.icon className="size-5" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-bold leading-none">{item.label}</p>
                                <p className={`text-[10px] mt-1 font-medium ${activeTab === item.id ? 'text-white/60' : 'text-slate-400'
                                    }`}>
                                    {item.description}
                                </p>
                            </div>
                            <ChevronRight className={`size-4 transition-transform ${activeTab === item.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
                                }`} />
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-6 bg-indigo-50 rounded-[32px] border border-indigo-100 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 text-white p-1 rounded-md">
                            <ShieldAlert className="size-3" />
                        </div>
                        <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Plan Pro</p>
                    </div>
                    <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                        Obtén acceso a recordatorios ilimitados y reportes avanzados de salud.
                    </p>
                    <button className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-indigo-100">
                        Actualizar Ahora
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-6 lg:px-12 bg-slate-50/30">
                <div className="py-8 animate-in fade-in duration-500">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
