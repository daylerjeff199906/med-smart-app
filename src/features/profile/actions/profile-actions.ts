"use server"

import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import type { ProfileInput, HealthDataInput, EmergencyContactInput } from "@/features/profile/types/profile"

interface ActionResult {
  success: boolean
  error?: string
}

/**
 * Actualiza el perfil básico del usuario
 */
export async function updateProfileAction(
  data: ProfileInput,
  locale: string
): Promise<ActionResult> {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "No autorizado" }
    }

    const supabase = await createClient()
    
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        birth_date: data.birthDate || null,
        gender: data.gender || null,
        avatar_url: data.avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)

    if (error) {
      console.error("Error updating profile:", error)
      return { success: false, error: "Error al actualizar el perfil" }
    }

    revalidatePath(`/${locale}/perfil`)
    return { success: true }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "Error inesperado" }
  }
}

/**
 * Actualiza los datos de salud del usuario
 */
export async function updateHealthDataAction(
  data: HealthDataInput,
  locale: string
): Promise<ActionResult> {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "No autorizado" }
    }

    const supabase = await createClient()

    // Verificar si ya existe registro de health_data
    const { data: existingData } = await supabase
      .from("health_data")
      .select("id")
      .eq("profile_id", session.user.id)
      .single()

    const healthDataPayload = {
      profile_id: session.user.id,
      weight: data.weight || null,
      height: data.height || null,
      blood_type: data.bloodType || null,
      allergies: data.allergies || null,
      chronic_conditions: data.chronicConditions || null,
      has_diabetes: data.hasDiabetes,
      has_hypertension: data.hasHypertension,
      updated_at: new Date().toISOString(),
    }

    if (existingData) {
      // Actualizar registro existente
      const { error } = await supabase
        .from("health_data")
        .update(healthDataPayload)
        .eq("id", existingData.id)

      if (error) {
        console.error("Error updating health data:", error)
        return { success: false, error: "Error al actualizar datos médicos" }
      }
    } else {
      // Crear nuevo registro
      const { error } = await supabase
        .from("health_data")
        .insert(healthDataPayload)

      if (error) {
        console.error("Error inserting health data:", error)
        return { success: false, error: "Error al crear datos médicos" }
      }
    }

    revalidatePath(`/${locale}/perfil/salud`)
    return { success: true }
  } catch (error) {
    console.error("Update health data error:", error)
    return { success: false, error: "Error inesperado" }
  }
}

/**
 * Actualiza los contactos de emergencia del usuario
 */
export async function updateEmergencyContactsAction(
  contacts: EmergencyContactInput[],
  locale: string
): Promise<ActionResult> {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "No autorizado" }
    }

    const supabase = await createClient()

    // Eliminar contactos existentes
    const { error: deleteError } = await supabase
      .from("emergency_contacts")
      .delete()
      .eq("profile_id", session.user.id)

    if (deleteError) {
      console.error("Error deleting contacts:", deleteError)
      return { success: false, error: "Error al actualizar contactos" }
    }

    // Insertar nuevos contactos
    if (contacts.length > 0) {
      const contactsPayload = contacts.map((contact, index) => ({
        profile_id: session.user.id,
        contact_name: contact.contactName,
        phone_number: contact.phoneNumber,
        relationship: contact.relationship,
        priority_order: contact.priorityOrder ?? index,
      }))

      const { error: insertError } = await supabase
        .from("emergency_contacts")
        .insert(contactsPayload)

      if (insertError) {
        console.error("Error inserting contacts:", insertError)
        return { success: false, error: "Error al guardar contactos" }
      }
    }

    revalidatePath(`/${locale}/perfil/contactos`)
    return { success: true }
  } catch (error) {
    console.error("Update contacts error:", error)
    return { success: false, error: "Error inesperado" }
  }
}
