import type { Metadata } from "next";
import { AuthLayoutShell } from "@/features/auth/components/auth-layout-shell";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account",
};

/**
 * Layout principal para páginas de autenticación
 * Implementa el diseño split-screen con soporte de i18n
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}

