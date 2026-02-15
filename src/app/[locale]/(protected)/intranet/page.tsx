import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";
import { logoutAction } from "@/features/auth/actions/logout";

export const metadata: Metadata = {
  title: "Dashboard | MedSmart",
  description: "Your personal medical dashboard",
};

interface IntranetPageProps {
  params: Promise<{ locale: string }>;
}

export default async function IntranetPage({ params }: IntranetPageProps): Promise<React.ReactElement> {
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

  if (!session.onboardingCompleted) {
    redirect(getLocalizedRoute(ROUTES.ONBOARDING, locale));
  }

  const handleLogout = logoutAction.bind(null, locale);

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
            <span>MedSmart Intranet</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
              {session.user.email}
            </span>
            <form action={handleLogout}>
              <button
                type="submit"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground border border-border hover:bg-muted/50 transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Welcome back! Here&apos;s a quick overview of your medical management.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Patient Visits", value: "1,234", trend: "+12%", color: "text-primary" },
            { label: "Active Consultations", value: "89", trend: "+5%", color: "text-primary" },
            { label: "Medical Revenue", value: "$12,345", trend: "+8%", color: "text-primary" },
            { label: "Patient Satisfaction", value: "4.9/5", trend: "+2%", color: "text-green-600" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-xl shadow-primary/5 border border-border/50 transition-all hover:shadow-primary/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</h3>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-3xl font-black text-foreground">{stat.value}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-md bg-muted ${stat.color}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-white p-8 shadow-xl shadow-primary/5 border border-border/50">
            <h3 className="mb-6 text-xl font-bold text-foreground">Recent Appointments</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground italic bg-muted/30 p-4 rounded-xl text-center border border-dashed border-border">
                No upcoming appointments scheduled for today.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-xl shadow-primary/5 border border-border/50">
            <h3 className="mb-6 text-xl font-bold text-foreground">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Consultation
              </button>
              <button className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-foreground hover:bg-muted/50 transition-all active:scale-95">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

