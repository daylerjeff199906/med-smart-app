import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

const locales = ["en", "es"];
const defaultLocale = "es";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Handle locale redirection
    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        // Redirect to default locale if no locale is present
        const locale = defaultLocale;
        request.nextUrl.pathname = `/${locale}${pathname}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // Extract locale and base pathname
    const segments = pathname.split("/");
    const locale = segments[1];
    const baseEmailPath = segments.slice(2).join("/");
    const currentPath = `/${baseEmailPath}`;

    // 2. Session Protection
    const session = await getSessionFromRequest(request);
    const isAuthPage = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD].some(route => currentPath.startsWith(route));
    const isProtectedPage = currentPath.startsWith(ROUTES.ONBOARDING) || currentPath.startsWith(ROUTES.DASHBOARD);

    // If user is logged in and tries to access auth pages, redirect to dashboard or onboarding
    if (session && isAuthPage) {
        const target = session.onboardingCompleted ? ROUTES.DASHBOARD : ROUTES.ONBOARDING;
        return NextResponse.redirect(new URL(getLocalizedRoute(target, locale), request.url));
    }

    // If user is NOT logged in and tries to access protected pages, redirect to login
    if (!session && isProtectedPage) {
        const loginUrl = new URL(getLocalizedRoute(ROUTES.LOGIN, locale), request.url);
        // Add current path as redirect param
        loginUrl.searchParams.set("redirect", currentPath);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        // Skip all internal paths (_next)
        // Skip all static files
        "/((?!_next|api|.*\\..*).*)",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/onboarding",
        "/intranet/:path*",
    ],
};
