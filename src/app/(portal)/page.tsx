import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to Greenfield App",
};

/**
 * Portal Landing Page
 * Página pública de bienvenida
 * Implementación async según documentación de Next.js
 */
export default async function PortalPage(): Promise<React.ReactElement> {
  let session = null;
  
  try {
    session = await getSession();
  } catch {
    // Error al leer sesión (cookie corrupta), tratar como no autenticado
    session = null;
  }

  // Si el usuario está autenticado, redirigir según su estado
  if (session) {
    if (session.onboardingCompleted) {
      redirect("/intranet");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Greenfield</h1>
          <nav className="flex gap-4">
            <a
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to the Future
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Build something amazing with our modern stack. Next.js, TypeScript,
              Tailwind, and Supabase working together.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/register"
                className="rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="text-base font-semibold leading-6 text-gray-900"
              >
                Sign In <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">Secure Auth</h3>
                <p className="text-gray-600">
                  Enterprise-grade authentication with encrypted sessions
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">Modern Stack</h3>
                <p className="text-gray-600">
                  Built with Next.js 16, React 19, and TypeScript 5
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">Type Safe</h3>
                <p className="text-gray-600">
                  Strict TypeScript with end-to-end type safety
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Greenfield. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
