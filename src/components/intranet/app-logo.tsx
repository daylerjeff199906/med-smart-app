"use client"

import { Heart } from "lucide-react"
import { appConfig } from "@/lib/constants/intranet-menu"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import { getLocalizedRoute } from "@/lib/routes"

export function AppLogo() {
  const { locale } = useTranslation()

  return (
    <Link href={getLocalizedRoute(appConfig.url, locale)} className="flex items-center gap-2 px-2">
      <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <Heart className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{appConfig.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {appConfig.description}
        </span>
      </div>
    </Link>
  )
}
