"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface PortalHeaderProps {
  t: {
    nav: { features: string; about: string; contact: string }
    login: string
    register: string
  }
}

export function PortalHeader({ t }: PortalHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const params = useParams()
  const locale = params.locale as string || "es"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const ROUTES = {
    LOGIN: "/login",
    REGISTER: "/register",
  }

  const getLocalizedRoute = (route: string) => `/${locale}${route}`

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100" 
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors ${
            scrolled ? "bg-primary" : "bg-white/20 backdrop-blur-sm"
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-5 h-5 ${scrolled ? "text-white" : "text-white"}`}
            >
              <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
            </svg>
          </div>
          <span className={`font-bold text-2xl tracking-tight transition-colors ${scrolled ? "text-slate-800" : "text-white"}`}>
            BEQUI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#features" 
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-slate-600 hover:text-primary" : "text-white/80 hover:text-white"
            }`}
          >
            {t.nav.features}
          </a>
          <a 
            href="#about" 
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-slate-600 hover:text-primary" : "text-white/80 hover:text-white"
            }`}
          >
            {t.nav.about}
          </a>
          <a 
            href="#contact" 
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-slate-600 hover:text-primary" : "text-white/80 hover:text-white"
            }`}
          >
            {t.nav.contact}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={getLocalizedRoute(ROUTES.LOGIN)}
            className={`text-sm font-semibold transition-colors ${
              scrolled ? "text-slate-600 hover:text-primary" : "text-white/80 hover:text-white"
            }`}
          >
            {t.login}
          </Link>
          <Link
            href={getLocalizedRoute(ROUTES.REGISTER)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all ${
              scrolled 
                ? "bg-primary text-white" 
                : "bg-white text-primary hover:bg-white/90"
            }`}
          >
            {t.register}
          </Link>
        </div>
      </div>
    </header>
  )
}
