import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Sign In | BEQUI",
  description: "Sign in to your account",
};

interface LoginPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  const sParams = await searchParams;
  const redirectTo = sParams.redirect || getLocalizedRoute(ROUTES.ONBOARDING, locale);

  return (
    <div className="w-full">
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}

