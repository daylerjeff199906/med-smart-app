import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
};

/**
 * Intranet Dashboard Page
 * Página protegida del dashboard
 * Implementación async según documentación de Next.js
 */
export default async function IntranetPage(): Promise<React.ReactElement> {
  let session = null;
  
  try {
    session = await getSession();
  } catch {
    // Error al leer sesión, redirigir a login
    redirect("/login");
  }

  // Verificación de sesión (redundante con middleware pero segura)
  if (!session) {
    redirect("/login");
  }

  // Verificación de onboarding
  if (!session.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold">Greenfield Intranet</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">89</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">$12,345</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Growth</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">+23%</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">No recent activity to display.</p>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                Create New Project
              </button>
              <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Invite Team Member
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
