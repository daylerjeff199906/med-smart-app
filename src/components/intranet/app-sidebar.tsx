"use client"

import * as React from "react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { AppLogo } from "./app-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { mainNavigation, projectsNavigation } from "@/lib/constants/intranet-menu"

// Datos de ejemplo del usuario - en producción vendrían de la sesión
const user = {
  name: "Dr. García",
  email: "dr.garcia@bequi.com",
  avatar: "/avatars/dr-garcia.jpg",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={mainNavigation} />
        <NavProjects projects={projectsNavigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
