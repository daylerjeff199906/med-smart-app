import { SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "./site-header"
import { getSession } from "@/lib/session"

interface LayoutWrapperProps {
  children: React.ReactNode
  sectionTitle?: string
}

export async function LayoutWrapper({
  children,
  sectionTitle,
}: LayoutWrapperProps) {
  const session = await getSession()
  const userId = session?.user?.id || ""

  return (
    <SidebarInset>
      <SiteHeader sectionTitle={sectionTitle} userId={userId} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:pt-4">
        {children}
      </div>
    </SidebarInset>
  )
}
