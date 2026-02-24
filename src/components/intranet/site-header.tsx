'use client'
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { NotificationDropdown } from "@/features/notifications/components/notification-dropdown"
import Link from "next/link"
import { getLocalizedRoute } from "@/lib/routes"
import { useTranslation } from "@/hooks/use-translation"

interface SiteHeaderProps {
  sectionTitle?: string
  userId: string
}

export function SiteHeader({ sectionTitle, userId }: SiteHeaderProps) {
  const { locale } = useTranslation()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-50 border-b border-slate-200 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href={getLocalizedRoute("/intranet", locale)}>
                  Intranet
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{sectionTitle || "Dashboard"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Search Bar matching image 1 */}
      <div className="flex-1 flex justify-center max-w-md mx-auto px-4">
        <div className="relative w-full group">
          <Input
            placeholder="Buscar..."
            className="h-10 w-full bg-slate-50 border-none rounded-2xl pl-4 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-slate-200 transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-4 px-4">
        {userId && (
          <NotificationDropdown userId={userId} locale={locale} />
        )}
      </div>
    </header>
  )
}
