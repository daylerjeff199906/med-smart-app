"use server"

import { createClient } from "@/utils/supabase/server"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { medicationPlanSchema, medicationLogSchema, type MedicationPlanInput, type MedicationLogInput } from "../types/medication"

function getZodErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ message: string }> }
        return zodError.errors[0]?.message || "Validation error"
    }
    return "Unknown error"
}

export async function getMedicationPlans(userId: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from("medication_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching medication plans:", error)
        return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
}

export async function getMedicationPlanById(planId: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from("medication_plans")
        .select("*")
        .eq("id", planId)
        .single()

    if (error) {
        console.error("Error fetching medication plan:", error)
        return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
}

export async function createMedicationPlan(data: MedicationPlanInput, userId: string) {
    const supabase = await createClient()
    
    const validation = medicationPlanSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: getZodErrorMessage(validation.error) }
    }

    const { data: plan, error } = await supabase
        .from("medication_plans")
        .insert({
            user_id: userId,
            name: data.name,
            prescription_id: data.prescriptionId || null,
            form: data.form,
            dose_amount: data.doseAmount,
            dose_unit: data.doseUnit,
            frequency: data.frequency,
            frequency_interval: data.frequencyInterval || null,
            frequency_days: data.frequencyDays || null,
            times_of_day: data.timesOfDay || null,
            specific_times: data.specificTimes || null,
            instructions: data.instructions || null,
            current_stock: data.currentStock || 0,
            low_stock_threshold: data.lowStockThreshold || 10,
            expiration_date: data.expirationDate || null,
            start_date: data.startDate || new Date().toISOString().split("T")[0],
            end_date: data.endDate || null,
            is_active: data.isActive ?? true,
            notify_via_email: data.notifyViaEmail ?? false,
            sync_to_calendar: data.syncToCalendar ?? false,
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating medication plan:", error)
        return { success: false, error: error.message }
    }

    revalidatePath("/es/perfil")
    revalidatePath("/en/perfil")
    
    return { success: true, data: plan }
}

export async function updateMedicationPlan(planId: string, data: Partial<MedicationPlanInput>) {
    const supabase = await createClient()
    
    const updateData: Record<string, unknown> = {
        name: data.name,
        form: data.form,
        dose_amount: data.doseAmount,
        dose_unit: data.doseUnit,
        frequency: data.frequency,
        frequency_interval: data.frequencyInterval,
        frequency_days: data.frequencyDays,
        times_of_day: data.timesOfDay,
        specific_times: data.specificTimes,
        instructions: data.instructions,
        current_stock: data.currentStock,
        low_stock_threshold: data.lowStockThreshold,
        expiration_date: data.expirationDate,
        start_date: data.startDate,
        end_date: data.endDate,
        is_active: data.isActive,
        notify_via_email: data.notifyViaEmail,
        sync_to_calendar: data.syncToCalendar,
    }

    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
            delete updateData[key]
        }
    })

    const { data: plan, error } = await supabase
        .from("medication_plans")
        .update(updateData)
        .eq("id", planId)
        .select()
        .single()

    if (error) {
        console.error("Error updating medication plan:", error)
        return { success: false, error: error.message }
    }

    revalidatePath("/es/perfil")
    revalidatePath("/en/perfil")
    
    return { success: true, data: plan }
}

export async function deleteMedicationPlan(planId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from("medication_plans")
        .update({ is_active: false })
        .eq("id", planId)

    if (error) {
        console.error("Error deleting medication plan:", error)
        return { success: false, error: error.message }
    }

    revalidatePath("/es/perfil")
    revalidatePath("/en/perfil")
    
    return { success: true }
}

export async function getMedicationLogs(userId: string, date?: string) {
    const supabase = await createClient()
    
    const targetDate = date || new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
        .from("medication_logs")
        .select(`
            *,
            medication_plans (
                name,
                form,
                dose_amount,
                dose_unit
            )
        `)
        .eq("user_id", userId)
        .eq("scheduled_date", targetDate)
        .order("scheduled_time", { ascending: true })

    if (error) {
        console.error("Error fetching medication logs:", error)
        return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
}

export async function getMedicationLogsByPlan(planId: string, startDate?: string, endDate?: string) {
    const supabase = await createClient()
    
    let query = supabase
        .from("medication_logs")
        .select("*")
        .eq("plan_id", planId)

    if (startDate) {
        query = query.gte("scheduled_date", startDate)
    }
    if (endDate) {
        query = query.lte("scheduled_date", endDate)
    }

    const { data, error } = await query.order("scheduled_date", { ascending: false })

    if (error) {
        console.error("Error fetching medication logs by plan:", error)
        return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
}

export async function createMedicationLog(data: MedicationLogInput, userId: string) {
    const supabase = await createClient()
    
    const validation = medicationLogSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: getZodErrorMessage(validation.error) }
    }

    const { data: log, error } = await supabase
        .from("medication_logs")
        .insert({
            plan_id: data.planId,
            user_id: userId,
            scheduled_date: data.scheduledDate,
            scheduled_time: data.scheduledTime || null,
            actual_taken_time: data.actualTakenTime || null,
            status: data.status,
            notes: data.notes || null,
            dose_taken: data.doseTaken || null,
            dose_taken_unit: data.doseTakenUnit || null,
            missed_reason: data.missedReason || null,
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating medication log:", error)
        return { success: false, error: error.message }
    }

    if (data.status === "taken" && data.doseTaken) {
        const { data: plan } = await supabase
            .from("medication_plans")
            .select("current_stock")
            .eq("id", data.planId)
            .single()
        
        if (plan) {
            const newStock = Math.max(0, plan.current_stock - (data.doseTaken || 0))
            await supabase
                .from("medication_plans")
                .update({ current_stock: newStock })
                .eq("id", data.planId)
        }
    }

    revalidatePath("/es/perfil")
    revalidatePath("/en/perfil")
    
    return { success: true, data: log }
}

export async function updateMedicationLog(logId: string, data: Partial<MedicationLogInput>) {
    const supabase = await createClient()
    
    const updateData: Record<string, unknown> = {
        actual_taken_time: data.actualTakenTime,
        status: data.status,
        notes: data.notes,
        dose_taken: data.doseTaken,
        dose_taken_unit: data.doseTakenUnit,
        missed_reason: data.missedReason,
    }

    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
            delete updateData[key]
        }
    })

    const { data: log, error } = await supabase
        .from("medication_logs")
        .update(updateData)
        .eq("id", logId)
        .select()
        .single()

    if (error) {
        console.error("Error updating medication log:", error)
        return { success: false, error: error.message }
    }

    revalidatePath("/es/perfil")
    revalidatePath("/en/perfil")
    
    return { success: true, data: log }
}

export async function markMedicationAsTaken(
    planId: string, 
    userId: string, 
    scheduledDate: string, 
    scheduledTime?: string,
    doseTaken?: number
) {
    const supabase = await createClient()
    
    const { data: existingLog } = await supabase
        .from("medication_logs")
        .select("id")
        .eq("plan_id", planId)
        .eq("scheduled_date", scheduledDate)
        .maybeSingle()

    if (existingLog) {
        const { data: log, error } = await supabase
            .from("medication_logs")
            .update({
                status: "taken",
                actual_taken_time: new Date().toISOString(),
                dose_taken: doseTaken,
            })
            .eq("id", existingLog.id)
            .select()
            .single()

        if (error) {
            return { success: false, error: error.message }
        }
        
        if (doseTaken) {
            const { data: plan } = await supabase
                .from("medication_plans")
                .select("current_stock")
                .eq("id", planId)
                .single()
            
            if (plan) {
                const newStock = Math.max(0, plan.current_stock - doseTaken)
                await supabase
                    .from("medication_plans")
                    .update({ current_stock: newStock })
                    .eq("id", planId)
            }
        }

        revalidatePath("/es/perfil")
        revalidatePath("/en/perfil")
        
        return { success: true, data: log }
    }

    const { data: log, error } = await supabase
        .from("medication_logs")
        .insert({
            plan_id: planId,
            user_id: userId,
            scheduled_date: scheduledDate,
            scheduled_time: scheduledTime || null,
            actual_taken_time: new Date().toISOString(),
            status: "taken",
            dose_taken: doseTaken || null,
        })
        .select()
        .single()

    if (error) {
        console.error("Error marking medication as taken:", error)
        return { success: false, error: error.message }
    }

    if (doseTaken) {
        const { data: plan } = await supabase
            .from("medication_plans")
            .select("current_stock")
            .eq("id", planId)
            .single()
        
        if (plan) {
            const newStock = Math.max(0, plan.current_stock - doseTaken)
            await supabase
                .from("medication_plans")
                .update({ current_stock: newStock })
                .eq("id", planId)
        }
    }

    revalidatePath("/es/perfil")
    revalidatePath("/en/perfil")
    
    return { success: true, data: log }
}

export async function getLowStockMedications(userId: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from("medication_plans")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .lte("current_stock", 10)
        .order("current_stock", { ascending: true })

    if (error) {
        console.error("Error fetching low stock medications:", error)
        return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
}

export async function updateStock(planId: string, newStock: number) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from("medication_plans")
        .update({ current_stock: newStock })
        .eq("id", planId)
        .select()
        .single()

    if (error) {
        console.error("Error updating stock:", error)
        return { success: false, error: error.message }
    }

    revalidatePath("/es/perfil")
    revalidatePath("/en/perfil")
    
    return { success: true, data }
}
