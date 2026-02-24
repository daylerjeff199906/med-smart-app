"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { type Notification, type NotificationFilters } from "../types/notifications"

export async function getNotifications(userId: string, filters?: NotificationFilters) {
    const supabase = await createClient()

    let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (filters?.status === 'read') {
        query = query.eq("is_read", true)
    } else if (filters?.status === 'unread') {
        query = query.eq("is_read", false)
    }

    const { data, error } = await query

    if (error) {
        console.error("Error fetching notifications:", error)
        return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data as Notification[] }
}

export async function getUnreadNotificationsCount(userId: string) {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId)
        .eq("is_read", false)

    if (error) {
        console.error("Error fetching unread notifications count:", error)
        return { success: false, error: error.message, count: 0 }
    }

    return { success: true, count: count || 0 }
}

export async function markAsRead(notificationId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)

    if (error) {
        console.error("Error marking notification as read:", error)
        return { success: false, error: error.message }
    }

    revalidatePath("/es/intranet")
    revalidatePath("/en/intranet")
    revalidatePath("/es/intranet/notificaciones")
    revalidatePath("/en/intranet/notificaciones")

    return { success: true }
}

export async function markAllAsRead(userId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false)

    if (error) {
        console.error("Error marking all notifications as read:", error)
        return { success: false, error: error.message }
    }

    revalidatePath("/es/intranet")
    revalidatePath("/en/intranet")
    revalidatePath("/es/intranet/notificaciones")
    revalidatePath("/en/intranet/notificaciones")

    return { success: true }
}

export async function createNotification(data: {
    userId: string
    title: string
    message: string
    type: Notification['type']
    referenceId?: string
}) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("notifications")
        .insert({
            user_id: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
            reference_id: data.referenceId,
            is_read: false,
            created_at: new Date().toISOString()
        })

    if (error) {
        console.error("Error creating notification:", error)
        return { success: false, error: error.message }
    }

    revalidatePath("/es/intranet")
    revalidatePath("/en/intranet")

    return { success: true }
}
