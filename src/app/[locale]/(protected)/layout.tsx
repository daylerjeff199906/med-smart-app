import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const session = await getSession()
  const { locale } = await params

  if (!session) {
    redirect(`/${locale}/login`)
  }

  return (
    <>
      {children}
    </>
  )
}
