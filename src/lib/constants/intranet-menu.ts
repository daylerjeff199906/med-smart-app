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
  type LucideIcon
} from "lucide-react"

export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: MenuItem[]
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
        title: "Recetas",
        url: "/intranet/recetas",
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
    title: "Administración",
    items: [
      {
        title: "Reportes",
        url: "/intranet/reportes",
        icon: FileText,
      },
      {
        title: "Configuración",
        url: "/perfil",
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
