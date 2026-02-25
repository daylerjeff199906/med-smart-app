"use client"

import { useState, useEffect } from "react"
import { Bell, Check, MoreHorizontal, ExternalLink, Settings } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getNotifications, getUnreadNotificationsCount, markAsRead, markAllAsRead } from "@/features/notifications/actions/notification-actions"
import { type Notification } from "@/features/notifications/types/notifications"
import { NotificationItem } from "./notification-item"
import { useRouter } from "next/navigation"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface NotificationDropdownProps {
    userId: string
    locale: string
}

export function NotificationDropdown({ userId, locale }: NotificationDropdownProps) {
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const fetchNotificationsData = async () => {
        setLoading(true)
        const [notificationsRes, unreadRes] = await Promise.all([
            getNotifications(userId),
            getUnreadNotificationsCount(userId)
        ])

        if (notificationsRes.success) {
            setNotifications(notificationsRes.data.slice(0, 5)) // Solo los últimos 5
        }
        if (unreadRes.success) {
            setUnreadCount(unreadRes.count)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchNotificationsData()

        // Polling simple cada 1 minuto para nuevas notificaciones
        const interval = setInterval(fetchNotificationsData, 60000)
        return () => clearInterval(interval)
    }, [userId])

    const handleMarkAsRead = async (notification: Notification) => {
        if (!notification.is_read) {
            const res = await markAsRead(notification.id)
            if (res.success) {
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
                )
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        }
    }

    const handleMarkAllAsRead = async () => {
        const res = await markAllAsRead(userId)
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            setUnreadCount(0)
        }
    }

    const handleViewAll = () => {
        router.push(getLocalizedRoute(ROUTES.NOTIFICATIONS, locale))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0 rounded-2xl overflow-hidden shadow-2xl border-slate-100">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Notificaciones</h3>
                        <p className="text-[10px] text-slate-500 font-medium tracking-wide flex items-center gap-1">
                            {unreadCount > 0 ? `${unreadCount} nuevas por leer` : 'Todo al día'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-8 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-2 rounded-lg"
                        >
                            Marcar todo como leído
                        </Button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {loading && notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="size-8 rounded-full border-2 border-slate-100 border-t-blue-500 animate-spin mx-auto mb-2" />
                            <p className="text-xs text-slate-400 font-medium">Cargando...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                locale={locale}
                                onClick={handleMarkAsRead}
                            />
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Bell className="size-6 text-slate-300" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">No hay notificaciones</h4>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Vuelve pronto para ver novedades</p>
                        </div>
                    )}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={handleViewAll}
                        className="h-10 w-full text-xs font-bold text-slate-600 hover:text-slate-900 justify-center rounded-xl"
                    >
                        Ver todas las notificaciones
                        <ExternalLink className="size-3 ml-2" />
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
