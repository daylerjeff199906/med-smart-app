import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

/**
 * Página de Restablecimiento de Contraseña
 * Implementación async según documentación de Next.js
 */
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const token = params.token;

  return (
    <div className="w-full">
      <ResetPasswordForm token={token} />
    </div>
  );
}
