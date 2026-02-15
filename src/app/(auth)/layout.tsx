import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout para páginas de autenticación
 * Centra el contenido y aplica estilos consistentes
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Greenfield
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to the future
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
