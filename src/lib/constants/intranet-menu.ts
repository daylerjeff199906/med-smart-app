import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  Heart,
  Activity,
  Pill,
  Stethoscope,
  ChevronRight,
  User,
  HeartPulse,
  ShieldAlert,
  type LucideIcon
} from "lucide-react"

export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: MenuItem[]
  description?: string
}

export interface NavSection {
  title: string
  items: MenuItem[]
}

// Configuración principal del menú
export const mainNavigation: NavSection[] = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        url: "/intranet",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Citas",
        url: "/intranet/citas",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Salud",
    items: [
      {
        title: "Consultas",
        url: "/intranet/consultas",
        icon: Stethoscope,
      },
      {
        title: "Medicamentos",
        url: "/intranet/medicamentos",
        icon: Pill,
      },
      {
        title: "Agenda de Medicamentos",
        url: "/intranet/medicamentos/agenda",
        icon: Pill,
      },
      {
        title: "Seguimiento",
        url: "/intranet/seguimiento",
        icon: Activity,
      },
    ],
  },
  {
    title: "Perfil",
    items: [
      {
        title: "Mi Perfil",
        url: "/perfil",
        icon: User,
        description: "Información personal",
      },
      {
        title: "Datos Médicos",
        url: "/perfil/salud",
        icon: HeartPulse,
        description: "Biometría e historial",
      },
      {
        title: "Contactos",
        url: "/perfil/contactos",
        icon: ShieldAlert,
        description: "Contactos de emergencia",
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        title: "Reportes",
        url: "/intranet/reportes",
        icon: FileText,
      },
      {
        title: "Configuración",
        url: "/intranet/configuracion",
        icon: Settings,
      },
    ],
  },
]

// Información de la aplicación (reemplaza TeamSwitcher)
export const appConfig = {
  name: "Bequi",
  description: "SuperApp Médica",
  logo: "/logo.svg", // Ruta al logo
  url: "/intranet",
}
