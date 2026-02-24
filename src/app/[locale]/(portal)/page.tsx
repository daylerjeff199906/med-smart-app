import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";
import { PortalHeader } from "@/components/portal-header";

export const metadata: Metadata = {
  title: "BEQUI | Smart Medical Management",
  description: "Manage your health with the most advanced medical management platform.",
};

interface PortalPageProps {
  params: Promise<{ locale: string }>;
}

const content = {
  es: {
    heroBadge: "Tu salud, bajo control",
    heroTitle: "La plataforma médica que",
    heroTitleHighlight: "cuidan de ti",
    heroDesc: "Gestiona tus medicamentos, citas, datos de salud y contactos de emergencia en un solo lugar. Simple, seguro y siempre disponible.",
    ctaPrimary: "Prueba Gratis Ahora",
    ctaSecondary: "Ver Demo",
    featuresTitle: "Todo lo que necesitas para tu salud",
    featuresDesc: "Una plataforma completa para gestionar todos los aspectos de tu salud de forma sencilla y segura.",
    features: [
      {
        title: "Gestión de Medicamentos",
        description: "Controla tus medicamentos, horarios y dosis. Recibe recordatorios y evita olvidos.",
      },
      {
        title: "Contactos de Emergencia",
        description: "Guarda tus contactos de emergencia y accede a ellos rápidamente cuando los necesites.",
      },
      {
        title: "Datos de Salud",
        description: "Registra y monitorea tu peso, altura, tipo de sangre, alergias y condiciones crónicas.",
      },
      {
        title: "Citas Médicas",
        description: "Programa y gestiona tus citas médicas con recordatorios automáticos.",
      },
      {
        title: "Historial Médico",
        description: "Mantén un historial completo de tus consultas, diagnósticos y tratamientos.",
      },
      {
        title: "Notificaciones Inteligentes",
        description: "Recibe alertas sobre medicamentos, citas y cambios en tu estado de salud.",
      }
    ],
    aboutTitle: "¿Por qué elegir BEQUI?",
    benefits: [
      { title: "Fácil de usar", desc: "Interfaz intuitiva diseñada para todas las edades." },
      { title: "Tus datos seguros", desc: "Encriptación de nivel bancario para proteger tu información." },
      { title: "Acceso desde cualquier lugar", desc: "Disponible en web y móvil cuando lo necesites." },
    ],
    aboutStat: "100% Seguro y Confiable",
    ctaTitle: "Comienza a cuidar tu salud hoy",
    ctaDesc: "Únete a miles de usuarios que ya están gestionando su salud de forma inteligente con BEQUI.",
    ctaButton: "Crear Cuenta Gratis",
    nav: { features: "Características", about: "Nosotros", contact: "Contacto" },
    login: "Iniciar Sesión",
    register: "Comenzar Ahora",
    preview: "Vista previa de la aplicación",
    footer: {
      product: "Producto",
      company: "Empresa",
      legal: "Legal",
      features: "Características",
      prices: "Precios",
      security: "Seguridad",
      about: "Nosotros",
      blog: "Blog",
      contact: "Contacto",
      privacy: "Privacidad",
      terms: "Términos",
      cookies: "Cookies",
      copyright: "Todos los derechos reservados.",
      tagline: "Tu plataforma de gestión médica inteligente. Cuidamos de tu salud para que tú te preocupes por vivir."
    }
  },
  en: {
    heroBadge: "Your health, under control",
    heroTitle: "The medical platform that",
    heroTitleHighlight: "takes care of you",
    heroDesc: "Manage your medications, appointments, health data, and emergency contacts in one place. Simple, secure, and always available.",
    ctaPrimary: "Try Free Now",
    ctaSecondary: "Watch Demo",
    featuresTitle: "Everything you need for your health",
    featuresDesc: "A complete platform to manage all aspects of your health easily and securely.",
    features: [
      { title: "Medication Management", description: "Control your medications, schedules, and doses. Get reminders and avoid forgetting." },
      { title: "Emergency Contacts", description: "Save your emergency contacts and access them quickly when needed." },
      { title: "Health Data", description: "Register and monitor your weight, height, blood type, allergies, and chronic conditions." },
      { title: "Medical Appointments", description: "Schedule and manage your medical appointments with automatic reminders." },
      { title: "Medical History", description: "Keep a complete history of your consultations, diagnoses, and treatments." },
      { title: "Smart Notifications", description: "Receive alerts about medications, appointments, and changes in your health status." }
    ],
    aboutTitle: "Why choose BEQUI?",
    benefits: [
      { title: "Easy to use", desc: "Intuitive interface designed for all ages." },
      { title: "Your data is safe", desc: "Bank-level encryption to protect your information." },
      { title: "Access from anywhere", desc: "Available on web and mobile when you need it." }
    ],
    aboutStat: "100% Secure and Reliable",
    ctaTitle: "Start taking care of your health today",
    ctaDesc: "Join thousands of users who are already managing their health intelligently with BEQUI.",
    ctaButton: "Create Free Account",
    nav: { features: "Features", about: "About", contact: "Contact" },
    login: "Sign In",
    register: "Get Started",
    preview: "Application preview",
    footer: {
      product: "Product",
      company: "Company",
      legal: "Legal",
      features: "Features",
      prices: "Prices",
      security: "Security",
      about: "About",
      blog: "Blog",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      copyright: "All rights reserved.",
      tagline: "Your intelligent medical management platform. We take care of your health so you can focus on living."
    }
  }
};

const icons = [
  "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
];

export default async function PortalPage({ params }: PortalPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = locale === "en" ? content.en : content.es;
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
      <PortalHeader t={t} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-20 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute top-40 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-20 lg:py-0">
              {/* Left Content */}
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white border border-white/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {t.heroBadge}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl text-white tracking-tight mb-6 leading-tight">
                  {t.heroTitle}{' '}
                  <span className="text-primary">
                    {t.heroTitleHighlight}
                  </span>
                </h1>

                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  {t.heroDesc}
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href={getLocalizedRoute(ROUTES.REGISTER, locale)}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    {t.ctaPrimary}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href={getLocalizedRoute(ROUTES.LOGIN, locale)}
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white hover:text-primary transition-colors"
                  >
                    {t.login}
                  </Link>
                </div>

                {/* Trust badges */}
                {/* <div className="mt-10 pt-8 border-t border-white/20">
                  <p className="text-sm text-white/60 mb-4">Registrado por más de 1,000+ usuarios</p>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-white">4.9/5</span>
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Right Image */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Main phone mockup */}
                  <div className="relative mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-slate-800 overflow-hidden">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-10" />

                    {/* Screen content */}
                    <div className="w-full h-full bg-white">
                      {/* App header */}
                      <div className="bg-primary p-4 pt-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <span className="text-white font-bold">BEQUI</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/20" />
                        </div>
                      </div>

                      {/* App content */}
                      <div className="p-4 space-y-4">
                        <div className="bg-slate-50 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-slate-500">Hola, Juan</span>
                            <span className="text-xs text-slate-400">Hoy</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full mb-2">
                            <div className="h-full w-3/4 bg-primary rounded-full" />
                          </div>
                          <p className="text-xs text-slate-500">2 de 4 medicamentos tomados</p>
                        </div>

                        <div className="space-y-2">
                          {[
                            { name: "Aspirina", time: "8:00 AM", status: "taken" },
                            { name: "Vitamina C", time: "12:00 PM", status: "pending" },
                            { name: "Omeprazol", time: "8:00 PM", status: "pending" }
                          ].map((med, i) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${med.status === 'taken' ? 'bg-green-100' : 'bg-primary/10'}`}>
                                  {med.status === 'taken' ? (
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{med.name}</p>
                                  <p className="text-xs text-slate-400">{med.time}</p>
                                </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 ${med.status === 'taken' ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>
                                {med.status === 'taken' && (
                                  <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-primary/5 rounded-xl p-3">
                          <p className="text-xs font-medium text-primary">Próxima cita</p>
                          <p className="text-sm text-slate-900">Dr. García - 15 Feb</p>
                          <p className="text-xs text-slate-500">Cardiología</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute top-6 -right-8 bg-white rounded-2xl p-4 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">¡Saludable!</p>
                        <p className="text-xs text-slate-500">Todo al día</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Recordatorios</p>
                        <p className="text-xs text-slate-500">Nunca olvides</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile image only */}
              <div className="lg:hidden relative mt-8">
                <div className="relative mx-auto w-[240px]">
                  <div className="w-full aspect-[9/16] bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-600 font-medium">{t.preview}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {t.featuresTitle}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {t.featuresDesc}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.features.map((feature, i) => (
                <div
                  key={i}
                  className="group rounded-2xl bg-white p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-primary-foreground" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icons[i]} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-primary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  {t.aboutTitle}
                </h2>
                <div className="space-y-6">
                  {t.benefits.map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{benefit.title}</h4>
                        <p className="text-slate-600">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="w-full aspect-square max-w-md mx-auto bg-primary/10 rounded-3xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-5xl md:text-6xl font-black text-primary mb-2">{t.aboutStat}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              {t.ctaDesc}
            </p>
            <Link
              href={getLocalizedRoute(ROUTES.REGISTER, locale)}
              className="inline-flex rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              {t.ctaButton}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-primary-foreground"
                  >
                    <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
                  </svg>
                </div>
                <span className="font-bold text-xl">BEQUI</span>
              </div>
              <p className="text-slate-400 text-sm">
                {t.footer.tagline}
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.features}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.prices}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.security}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.about}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.blog}</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.contact}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.privacy}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.terms}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">{t.footer.cookies}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} BEQUI. {t.footer.copyright}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.163-2.759 6.163-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
