import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Dashboard - Bequi",
  description: "Panel de control de la SuperApp Médica Bequi",
}

interface IntranetPageProps {
  params: Promise<{ locale: string }>;
}

export default async function IntranetPage({ params }: IntranetPageProps) {
  const { locale } = await params;
  let session = null;

  try {
    session = await getSession();
  } catch {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
  }

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
  }

  if (!session.onboardingCompleted) {
    redirect(getLocalizedRoute(ROUTES.ONBOARDING, locale));
  }

  return (
    <LayoutWrapper sectionTitle="Dashboard">
      {/* Stats Grid */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {[
          { label: "Visitas de Pacientes", value: "1,234", trend: "+12%", color: "text-primary" },
          { label: "Consultas Activas", value: "89", trend: "+5%", color: "text-primary" },
          { label: "Ingresos", value: "$12,345", trend: "+8%", color: "text-primary" },
          { label: "Satisfacción", value: "4.9/5", trend: "+2%", color: "text-green-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-muted/50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className={`text-xs font-medium ${stat.color}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 bg-muted/50 rounded-xl p-6">
          <h3 className="mb-4 text-lg font-semibold">Citas Recientes</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              No hay citas programadas para hoy.
            </p>
          </div>
        </div>
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="mb-4 text-lg font-semibold">Acciones Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90">
              Nueva Consulta
            </button>
            <button className="w-full border border-border rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted">
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 min-h-[400px] flex-1 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <p className="text-muted-foreground text-sm">
          Aquí se mostrará la actividad reciente del sistema.
        </p>
      </div>
    </LayoutWrapper>
  )
}
