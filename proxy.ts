import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// ==========================================
// Configuration
// ==========================================

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const PROTECTED_ROUTES = ['/intranet', '/onboarding'];
const SESSION_COOKIE_NAME = 'session';
const SESSION_SECRET = process.env.SESSION_SECRET;
const DEFAULT_LOCALE = 'es';
const SUPPORTED_LOCALES = ['en', 'es'];

interface SessionPayload {
  user: {
    id: string;
    email: string;
  };
  onboardingCompleted: boolean;
  expiresAt: number;
}

/**
 * Desencripta la sesión desde cookies
 */
async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie || !SESSION_SECRET) return null;

  try {
    const { payload } = await jwtVerify(
      sessionCookie, 
      new TextEncoder().encode(SESSION_SECRET),
      { algorithms: ['HS256'] }
    );
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Obtiene el locale de la URL o usa el default
 */
function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    return firstSegment;
  }
  return null;
}

// ==========================================
// Proxy (formerly Middleware in Next.js < 16)
// ==========================================

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  
  // Obtener locale de la URL
  const locale = getLocaleFromPathname(pathname);
  const pathnameWithoutLocale = locale 
    ? pathname.replace(`/${locale}`, '') || '/'
    : pathname;
  
  const session = await getSessionFromRequest(request);
  const isAuthenticated = !!session;
  const onboardingCompleted = session?.onboardingCompleted ?? false;

  // ==========================================
  // 1. Handle API routes (allow all)
  // ==========================================
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // ==========================================
  // 2. Handle static files (allow all)
  // ==========================================
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|css|js|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // ==========================================
  // 3. Redirect root to default locale
  // ==========================================
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  // ==========================================
  // 4. If no locale in URL, add default locale
  // ==========================================
  if (!locale) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url));
  }

  // ==========================================
  // 5. Root path with locale logic
  // ==========================================
  if (pathnameWithoutLocale === '/') {
    if (isAuthenticated) {
      if (onboardingCompleted) {
        return NextResponse.redirect(new URL(`/${locale}/intranet`, request.url));
      } else {
        return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url));
      }
    }
    // No autenticado - permitir acceso a landing (portal)
    return NextResponse.next();
  }

  // ==========================================
  // 6. Not authenticated - redirect to login
  // ==========================================
  if (!isAuthenticated) {
    // Allow public routes
    if (PUBLIC_ROUTES.some(route => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route + '/'))) {
      return NextResponse.next();
    }

    // Redirect to login for protected routes
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  // ==========================================
  // 7. Authenticated but onboarding incomplete
  // ==========================================
  if (isAuthenticated && !onboardingCompleted) {
    // Allow access to onboarding page
    if (pathnameWithoutLocale === '/onboarding' || pathnameWithoutLocale.startsWith('/onboarding/')) {
      return NextResponse.next();
    }

    // Redirect auth routes to onboarding
    if (AUTH_ROUTES.includes(pathnameWithoutLocale)) {
      return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url));
    }

    // Redirect other protected routes to onboarding
    if (PROTECTED_ROUTES.some(route => pathnameWithoutLocale.startsWith(route)) && pathnameWithoutLocale !== '/onboarding') {
      return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url));
    }

    return NextResponse.next();
  }

  // ==========================================
  // 8. Authenticated and onboarding complete
  // ==========================================
  if (isAuthenticated && onboardingCompleted) {
    // Redirect auth routes to intranet
    if (AUTH_ROUTES.includes(pathnameWithoutLocale)) {
      return NextResponse.redirect(new URL(`/${locale}/intranet`, request.url));
    }

    // Redirect onboarding to intranet
    if (pathnameWithoutLocale === '/onboarding' || pathnameWithoutLocale.startsWith('/onboarding/')) {
      return NextResponse.redirect(new URL(`/${locale}/intranet`, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// ==========================================
// Matcher Configuration
// ==========================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
