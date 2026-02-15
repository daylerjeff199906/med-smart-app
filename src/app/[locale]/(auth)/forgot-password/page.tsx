import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

/**
 * Página de Recuperación de Contraseña
 * Implementación async según documentación de Next.js
 */
export default async function ForgotPasswordPage(): Promise<React.ReactElement> {
  return (
    <div className="w-full">
      <ForgotPasswordForm />
    </div>
  );
}
