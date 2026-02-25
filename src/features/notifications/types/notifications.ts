export type NotificationType = 'medication_reminder' | 'low_stock' | 'appointment' | 'system'

export interface Notification {
    id: string
    user_id: string
    title: string
    message: string
    type: NotificationType
    reference_id?: string | null
    is_read: boolean
    sent_at?: string | null
    created_at: string
}

export interface NotificationFilters {
    status: 'all' | 'read' | 'unread'
}
