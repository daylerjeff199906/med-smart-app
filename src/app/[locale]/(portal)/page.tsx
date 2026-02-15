import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "MedSmart | Smart Medical Management",
  description: "Manage your health with the most advanced medical management platform.",
};

interface PortalPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PortalPage({ params }: PortalPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  let session = null;

  try {
    session = await getSession();
  } catch {
    session = null;
  }

  if (session) {
    if (session.onboardingCompleted) {
      redirect(getLocalizedRoute(ROUTES.DASHBOARD, locale));
    } else {
      redirect(getLocalizedRoute(ROUTES.ONBOARDING, locale));
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
              </svg>
            </div>
            <span className="tracking-tight text-foreground">MedSmart</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href={getLocalizedRoute(ROUTES.LOGIN, locale)}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={getLocalizedRoute(ROUTES.REGISTER, locale)}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-white pb-24 pt-20 sm:pb-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
              <div className="relative z-10 mx-auto max-w-2xl lg:col-span-12 lg:max-w-none lg:text-center">
                <div className="mb-8 flex justify-center">
                  <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/20">
                    Revolutionizing Healthcare
                  </span>
                </div>
                <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-7xl">
                  Smart Care for <span className="text-primary italic">Everyone.</span>
                </h1>
                <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
                  The most advanced medical management platform. Coordinate care,
                  track health metrics, and connect with professionals in one secure place.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href={getLocalizedRoute(ROUTES.REGISTER, locale)}
                    className="w-full sm:w-auto rounded-full bg-primary px-10 py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href={getLocalizedRoute(ROUTES.LOGIN, locale)}
                    className="w-full sm:w-auto group flex items-center justify-center gap-2 text-lg font-bold text-foreground hover:text-primary transition-colors"
                  >
                    Watch Demo <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/2 -z-10 h-[600px] w-[800px] translate-x-1/2 rounded-full bg-primary/5 blur-3xl opacity-60" />
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-32 border-y border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-3">
              {[
                {
                  title: "Secure Encryption",
                  desc: "Enterprise-grade security using end-to-end encryption for all medical records.",
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                },
                {
                  title: "Real-time Metrics",
                  desc: "Monitor vital health statistics with precision tracking and instant analysis.",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z"
                },
                {
                  title: "Smart Network",
                  desc: "Integrated ecosystem connecting patients, doctors, and pharmacies seamlessly.",
                  icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                }
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-3xl bg-white p-8 shadow-sm border border-border/50 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                    <svg className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row border-t border-border/50 pt-16">
            <div className="flex items-center gap-2 text-muted-foreground font-bold text-xl grayscale opacity-60">
              <span className="tracking-tight italic">MedSmart</span>
            </div>
            <p className="text-sm text-muted-foreground order-last md:order-none">
              © {new Date().getFullYear()} MedSmart. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

