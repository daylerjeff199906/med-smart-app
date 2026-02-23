import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: {
    default: "BEQUI App",
    template: "%s | BEQUI",
  },
  description: "A modern Next.js application with authentication and onboarding",
  keywords: ["nextjs", "react", "authentication", "supabase", "Salud", "Medicamentos", "Recordatorios", "Citas", "Contactos", "Perfil", "Notificaciones", "Calendario"],
  authors: [{ name: "BEQUI" }],
  creator: "BEQUI Team",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BEQUI",
  },
  openGraph: {
    title: "BEQUI App",
    description: "A modern Next.js application with authentication and onboarding",
    url: "https://bequi.site",
    siteName: "BEQUI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BEQUI App",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

interface LocaleLayoutProps {
  children: React.ReactNode;
}

export default async function LocaleLayout({ children }: LocaleLayoutProps) {

  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background antialiased`}

      >
        {children}
      </body>
    </html>
  );
}
