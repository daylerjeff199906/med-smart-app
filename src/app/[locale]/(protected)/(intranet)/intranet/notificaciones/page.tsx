import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROUTES, getLocalizedRoute } from "@/lib/routes"
import { LayoutWrapper } from "@/components/intranet/layout-wrapper"
import { NotificationPageContent } from "@/features/notifications/components/notification-page-content"
import { getNotifications } from "@/features/notifications/actions/notification-actions"

export const metadata: Metadata = {
    title: "Notificaciones - Bequi",
    description: "Tus alertas y recordatorios de salud en Bequi",
}

interface NotificacionesPageProps {
    params: Promise<{ locale: string }>
}

export default async function NotificacionesPage({ params }: NotificacionesPageProps) {
    const { locale } = await params
    const session = await getSession()

    if (!session) {
        redirect(getLocalizedRoute(ROUTES.LOGIN, locale))
    }

    if (!session.onboardingCompleted) {
        redirect(getLocalizedRoute(ROUTES.ONBOARDING, locale))
    }

    const result = await getNotifications(session.user.id)

    return (
        <LayoutWrapper sectionTitle="Notificaciones">
            <NotificationPageContent
                initialNotifications={result.success ? result.data : []}
                userId={session.user.id}
                locale={locale}
            />
        </LayoutWrapper>
    )
}
