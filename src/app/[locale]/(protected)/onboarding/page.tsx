import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Onboarding | BEQUI",
  description: "Complete your profile setup",
};

interface OnboardingPageProps {
  params: Promise<{ locale: string }>;
}

import { createClient } from "@/utils/supabase/server";

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;
  let session = null;

  try {
    session = await getSession();
  } catch {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
  }

  if (!session) {
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
  }

  if (session.onboardingCompleted) {
    redirect(getLocalizedRoute(ROUTES.DASHBOARD, locale));
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    return redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <OnboardingForm profile={profile} />
      </main>
    </div>
  );
}



