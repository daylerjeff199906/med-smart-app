"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, HeartPulse, ShieldAlert, ChevronRight, Settings, ShieldCheck, Bell, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileNavItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  description: string
}

interface ProfileSidebarProps {
  locale: string
}

const mainNavItems: ProfileNavItem[] = [
  { 
    id: 'profile', 
    label: 'Mi Perfil', 
    href: '', 
    icon: User, 
    description: 'Información personal y cuenta' 
  },
  { 
    id: 'health', 
    label: 'Datos Médicos', 
    href: '/salud', 
    icon: HeartPulse, 
    description: 'Biometría e historial' 
  },
  { 
    id: 'emergency', 
    label: 'Contactos', 
    href: '/contactos', 
    icon: ShieldAlert, 
    description: 'En caso de emergencia' 
  },
]

const secondaryNavItems: ProfileNavItem[] = [
  { 
    id: 'security', 
    label: 'Seguridad', 
    href: '/seguridad', 
    icon: ShieldCheck, 
    description: 'Contraseña y accesos' 
  },
  { 
    id: 'notifications', 
    label: 'Notificaciones', 
    href: '/notificaciones', 
    icon: Bell, 
    description: 'Preferencias de avisos' 
  },
  { 
    id: 'billing', 
    label: 'Facturación', 
    href: '/facturacion', 
    icon: CreditCard, 
    description: 'Planes y pagos' 
  },
]

export function ProfileSidebar({ locale }: ProfileSidebarProps) {
  const pathname = usePathname()
  const basePath = `/${locale}/perfil`

  const isActive = (href: string) => {
    const fullPath = href ? `${basePath}${href}` : basePath
    return pathname === fullPath
  }

  const NavItem = ({ item }: { item: ProfileNavItem }) => {
    const fullHref = item.href ? `${basePath}${item.href}` : basePath
    const active = isActive(item.href)
    
    return (
      <Link
        href={fullHref}
        className={cn(
          "flex items-center gap-4 p-4 rounded-[24px] transition-all group",
          active
            ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
            : "text-slate-600 hover:bg-slate-50"
        )}
      >
        <div className={cn(
          "p-2 rounded-xl transition-colors",
          active ? "bg-white/10" : "bg-slate-100 group-hover:bg-white"
        )}>
          <item.icon className="size-5" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold leading-none">{item.label}</p>
          <p className={cn(
            "text-[10px] mt-1 font-medium",
            active ? "text-white/60" : "text-slate-400"
          )}>
            {item.description}
          </p>
        </div>
        <ChevronRight className={cn(
          "size-4 transition-transform",
          active ? "translate-x-1" : "opacity-0 group-hover:opacity-100"
        )} />
      </Link>
    )
  }

  return (
    <aside className="w-full lg:w-[350px] lg:border-r lg:border-slate-100 p-4 lg:p-8 flex flex-col gap-6 lg:gap-8 shrink-0">
      <div className="px-2 lg:px-4">
        <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">Configuración</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Perfil BEQUI</p>
      </div>

      <nav className="flex flex-col gap-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2 lg:px-4 mb-2">General</p>
        {mainNavItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>

      <nav className="flex flex-col gap-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2 lg:px-4 mb-2">Avanzado</p>
        {secondaryNavItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>

      <div className="mt-auto p-4 lg:p-6 bg-indigo-50 rounded-[24px] lg:rounded-[32px] border border-indigo-100 space-y-3">
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
  )
}
