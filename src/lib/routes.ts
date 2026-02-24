export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    ONBOARDING: "/onboarding",
    DASHBOARD: "/intranet",
    MEDICATION: "/intranet/medicamentos",
    ADD_MEDICATION: "/intranet/medicamentos/agregar",
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * Generates a localized URL
 * @param route The route path (from ROUTES constant)
 * @param locale The locale string (e.g., 'es', 'en')
 * @returns The localized URL string
 */
export function getLocalizedRoute(route: string, locale: string): string {
    // If the route already starts with a locale, don't re-localize
    if (route.startsWith(`/${locale}/`) || route === `/${locale}`) {
        return route;
    }

    // Ensure we don't double slash if route is "/"
    const cleanRoute = route.startsWith('/') ? route : `/${route}`;
    const finalRoute = cleanRoute === "/" ? "" : cleanRoute;

    return `/${locale}${finalRoute}`;
}
