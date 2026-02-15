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
        title: "Pacientes",
        url: "/intranet/pacientes",
        icon: Users,
        items: [
          {
            title: "Lista de Pacientes",
            url: "/intranet/pacientes",
            icon: ChevronRight,
          },
          {
            title: "Nuevo Paciente",
            url: "/intranet/pacientes/nuevo",
            icon: ChevronRight,
          },
          {
            title: "Historiales",
            url: "/intranet/pacientes/historiales",
            icon: ChevronRight,
          },
        ],
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
        url: "/intranet/configuracion",
        icon: Settings,
      },
    ],
  },
]

// Configuración de proyectos/secciones
export const projectsNavigation = [
  {
    name: "Cardiología",
    url: "/intranet/especialidades/cardiologia",
    icon: Heart,
  },
  {
    name: "Pediatría",
    url: "/intranet/especialidades/pediatria",
    icon: Users,
  },
]

// Información de la aplicación (reemplaza TeamSwitcher)
export const appConfig = {
  name: "Bequi",
  description: "SuperApp Médica",
  logo: "/logo.svg", // Ruta al logo
  url: "/intranet",
}
