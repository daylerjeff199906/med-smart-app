import { getSession } from "@/lib/session"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { HealthDataForm } from "@/features/profile/components/health-data-form"
import type { HealthDataInput } from "@/features/profile/types/profile"

interface HealthDataPageProps {
  params: Promise<{ locale: string }>
}

export default async function HealthDataPage({ params }: HealthDataPageProps) {
  const { locale } = await params
  const session = await getSession()

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale))
  }

  const supabase = await createClient()

  const { data: healthData, error } = await supabase
    .from("health_data")
    .select("weight, height, blood_type, allergies, chronic_conditions, has_diabetes, has_hypertension")
    .eq("profile_id", session.user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching health data:", error)
  }

  const initialData: HealthDataInput = {
    weight: healthData?.weight || "",
    height: healthData?.height || "",
    bloodType: (healthData?.blood_type as HealthDataInput["bloodType"]) || undefined,
    allergies: healthData?.allergies || "",
    chronicConditions: healthData?.chronic_conditions || "",
    hasDiabetes: healthData?.has_diabetes || false,
    hasHypertension: healthData?.has_hypertension || false,
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Datos Médicos</h1>
        <p className="text-slate-500 mt-1">
          Administra tu información de salud y condiciones médicas
        </p>
      </div>
      
      <HealthDataForm 
        defaultValues={initialData} 
        locale={locale}
      />
    </div>
  )
}
