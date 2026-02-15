import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession, updateSessionOnboarding } from "@/lib/session";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Complete your profile setup",
};

/**
 * Onboarding Page
 * Página intermedia para usuarios nuevos
 * Implementación async según documentación de Next.js
 */
export default async function OnboardingPage(): Promise<React.ReactElement> {
  let session = null;
  
  try {
    session = await getSession();
  } catch {
    // Error al leer sesión, redirigir a login
    redirect("/login");
  }

  // Verificación de sesión
  if (!session) {
    redirect("/login");
  }

  // Si ya completó onboarding, redirigir al intranet
  if (session.onboardingCompleted) {
    redirect("/intranet");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold">Greenfield</h1>
          <span className="text-sm text-gray-600">{session.user.email}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-gray-600">
            Let&apos;s get you set up with a few quick details
          </p>
        </div>

        <div className="mt-8">
          <OnboardingForm />
        </div>
      </main>
    </div>
  );
}

/**
 * Server Action para completar onboarding
 */
export async function completeOnboarding(): Promise<void> {
  "use server";
  await updateSessionOnboarding(true);
  redirect("/intranet");
}
