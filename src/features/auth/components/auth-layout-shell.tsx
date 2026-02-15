"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

interface AuthLayoutShellProps {
    children: React.ReactNode;
}

export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
    const { t, locale } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();

    const changeLocale = (newLocale: string) => {
        // Replace the locale segment in the current pathname
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPathname = segments.join("/");
        router.push(newPathname);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side: Form */}
            <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    {/* Logo */}
                    <Link
                        href={getLocalizedRoute(ROUTES.HOME, locale)}
                        className="mb-10 inline-flex flex-col items-center lg:items-start text-center lg:text-left group"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-110">
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
                            <span>BEQUI</span>
                        </div>
                    </Link>

                    {/* Form Content */}
                    {children}

                    {/* Locale Switcher */}
                    <div className="mt-8 flex justify-center gap-4 text-xs text-muted-foreground">
                        <button
                            onClick={() => changeLocale("en")}
                            className={locale === "en" ? "font-bold text-primary underline underline-offset-4" : "hover:text-primary transition-colors"}
                        >
                            ENGLISH
                        </button>
                        <div className="w-[1px] h-3 bg-muted-foreground/30 self-center" />
                        <button
                            onClick={() => changeLocale("es")}
                            className={locale === "es" ? "font-bold text-primary underline underline-offset-4" : "hover:text-primary transition-colors"}
                        >
                            ESPAÑOL
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side: Image (Hidden on mobile) */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 h-full w-full bg-slate-100 italic">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/40 dark:from-primary/20 dark:to-primary/5 mix-blend-multiply z-10" />
                    <div className="absolute inset-0 bg-black/30 z-10" />
                    <Image
                        className="h-full w-full object-cover"
                        src="/images/auth_background.webp"
                        alt="Medical background"
                        fill
                        priority
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-12 text-white z-20">
                        <h2 className="text-4xl font-extrabold tracking-tight">{t("auth.layout.title")}</h2>
                        <p className="mt-4 text-xl text-white/90 max-w-md">
                            {t("auth.layout.subtitle")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


