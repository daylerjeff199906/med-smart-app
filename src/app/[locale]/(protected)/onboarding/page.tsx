import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Onboarding | MedSmart",
  description: "Complete your profile setup",
};

interface OnboardingPageProps {
  params: Promise<{ locale: string }>;
}

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

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
              </svg>
            </div>
            <span>MedSmart</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
            {session.user.email}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
            Complete Your Profile
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Let&apos;s get you set up with a few quick details to personalize your experience.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-primary/5 border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <OnboardingForm />
        </div>
      </main>
    </div>
  );
}



