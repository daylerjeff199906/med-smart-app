"use client"

import { Bell, Pill, AlertTriangle, Calendar, Info } from "lucide-react"
import { formatTimeAgo } from "@/lib/time-utils"
import { type Notification } from "../types/notifications"
import { cn } from "@/lib/utils"

interface NotificationItemProps {
    notification: Notification
    locale: string
    onClick?: (notification: Notification) => void
}

const icons = {
    medication_reminder: Pill,
    low_stock: AlertTriangle,
    appointment: Calendar,
    system: Info,
}

const colors = {
    medication_reminder: "text-blue-500 bg-blue-50",
    low_stock: "text-amber-500 bg-amber-50",
    appointment: "text-purple-500 bg-purple-50",
    system: "text-slate-500 bg-slate-50",
}

export function NotificationItem({ notification, locale, onClick }: NotificationItemProps) {
    const Icon = icons[notification.type] || Bell
    const colorClass = colors[notification.type] || "text-slate-500 bg-slate-50"

    return (
        <button
            onClick={() => onClick?.(notification)}
            className={cn(
                "w-full flex items-start gap-4 p-4 text-left transition-colors hover:bg-slate-50 focus:bg-slate-50 outline-none",
                !notification.is_read && "bg-blue-50/30"
            )}
        >
            <div className={cn("shrink-0 p-2 rounded-xl", colorClass)}>
                <Icon className="size-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-xs font-bold truncate", !notification.is_read ? "text-slate-900" : "text-slate-600")}>
                        {notification.title}
                    </p>
                    {!notification.is_read && (
                        <span className="shrink-0 size-2 bg-blue-500 rounded-full" />
                    )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {notification.message}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {formatTimeAgo(notification.created_at, locale)}
                </p>
            </div>
        </button>
    )
}
