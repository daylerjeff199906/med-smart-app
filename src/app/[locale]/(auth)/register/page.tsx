import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

/**
 * Página de Registro
 * Implementación async según documentación de Next.js
 */
export default async function RegisterPage(): Promise<React.ReactElement> {
  return (
    <div className="w-full">
      <RegisterForm />
    </div>
  );
}
