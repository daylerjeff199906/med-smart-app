import { getSession } from "@/lib/session"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { EmergencyContactsForm } from "@/features/profile/components/emergency-contacts-form"
import type { EmergencyContactsListInput } from "@/features/profile/types/profile"

interface EmergencyContactsPageProps {
  params: Promise<{ locale: string }>
}

export default async function EmergencyContactsPage({ params }: EmergencyContactsPageProps) {
  const { locale } = await params
  const session = await getSession()

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale))
  }

  const supabase = await createClient()

  const { data: contacts, error } = await supabase
    .from("emergency_contacts")
    .select("id, contact_name, phone_number, relationship, priority_order")
    .eq("profile_id", session.user.id)
    .order('priority_order', { ascending: true })

  if (error) {
    console.error("Error fetching emergency contacts:", error)
  }

  const initialData: EmergencyContactsListInput = {
    contacts: (contacts || []).map((c) => ({
      id: c.id,
      contactName: c.contact_name,
      phoneNumber: c.phone_number,
      relationship: c.relationship,
      priorityOrder: c.priority_order,
    })),
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Contactos de Emergencia</h1>
        <p className="text-slate-500 mt-1">
          Gestiona las personas a contactar en caso de emergencia médica
        </p>
      </div>
      
      <EmergencyContactsForm 
        defaultValues={initialData} 
        locale={locale}
      />
    </div>
  )
}
