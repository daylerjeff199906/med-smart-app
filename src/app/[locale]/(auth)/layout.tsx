import type { Metadata } from "next";
import { AuthLayoutShell } from "@/features/auth/components/auth-layout-shell";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account",
};


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}

