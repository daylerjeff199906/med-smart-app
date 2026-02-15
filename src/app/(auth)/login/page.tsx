import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

/**
 * Página de Login
 * Implementación async según documentación de Next.js
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect || "/onboarding";

  return (
    <div className="w-full">
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
