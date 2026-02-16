import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "./site-header"

interface LayoutWrapperProps {
  children: React.ReactNode
  sectionTitle?: string
}

export function LayoutWrapper({
  children,
  sectionTitle,
}: LayoutWrapperProps) {
  return (
    <SidebarInset>
      <SiteHeader sectionTitle={sectionTitle} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {children}
      </div>
    </SidebarInset>
  )
}
