"use client"

import { useState } from "react"
import { Bell, Check, Filter, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationItem } from "./notification-item"
import { type Notification, type NotificationFilters } from "@/features/notifications/types/notifications"
import { markAsRead, markAllAsRead } from "@/features/notifications/actions/notification-actions"
import { cn } from "@/lib/utils"

interface NotificationPageContentProps {
    initialNotifications: Notification[]
    userId: string
    locale: string
}

export function NotificationPageContent({ initialNotifications, userId, locale }: NotificationPageContentProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const [filter, setFilter] = useState<NotificationFilters['status']>('all')
    const [searchQuery, setSearchQuery] = useState("")

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = filter === 'all' || (filter === 'unread' ? !n.is_read : n.is_read)
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleMarkAsRead = async (notification: Notification) => {
        if (!notification.is_read) {
            const res = await markAsRead(notification.id)
            if (res.success) {
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
                )
            }
        }
    }

    const handleMarkAllAsRead = async () => {
        const res = await markAllAsRead(userId)
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notificaciones</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Mantente informado sobre tus tratamientos y salud
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest h-10 px-4"
                    >
                        <Check className="size-4 mr-2" />
                        Marcar todo como leído
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Buscar notificaciones..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-sm"
                        />
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(['all', 'unread', 'read'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                                    filter === f
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {f === 'all' ? 'Todas' : f === 'unread' ? 'Sin leer' : 'Leídas'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                locale={locale}
                                onClick={handleMarkAsRead}
                            />
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <div className="size-16 rounded-[24px] bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <Bell className="size-8 text-slate-300" />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">No se encontraron notificaciones</h3>
                            <p className="text-xs text-slate-500 font-medium mt-2 max-w-xs mx-auto">
                                Intenta cambiar los filtros o realizar otra búsqueda para encontrar lo que necesitas.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => { setFilter('all'); setSearchQuery(""); }}
                                className="mt-4 text-blue-500 font-bold text-xs uppercase tracking-widest"
                            >
                                Limpiar filtros
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
