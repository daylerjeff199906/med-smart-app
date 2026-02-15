import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// ==========================================
// Route Configuration
// ==========================================

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const PROTECTED_ROUTES = ['/intranet', '/onboarding'];
const SESSION_COOKIE_NAME = 'session';
const SESSION_SECRET = process.env.SESSION_SECRET;

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
    // Sesión inválida o expirada
    return null;
  }
}

// ==========================================
// Proxy (formerly Middleware in Next.js < 16)
// ==========================================

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  
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
  // 3. Root path logic
  // ==========================================
  if (pathname === '/') {
    if (isAuthenticated) {
      // Usuario autenticado - redirigir según onboarding
      if (onboardingCompleted) {
        return NextResponse.redirect(new URL('/intranet', request.url));
      } else {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    }
    // No autenticado - permitir acceso a landing (portal)
    return NextResponse.next();
  }

  // ==========================================
  // 4. Not authenticated - redirect to login
  // ==========================================
  if (!isAuthenticated) {
    // Allow public routes
    if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
      return NextResponse.next();
    }

    // Redirect to login for protected routes
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ==========================================
  // 5. Authenticated but onboarding incomplete
  // ==========================================
  if (isAuthenticated && !onboardingCompleted) {
    // Allow access to onboarding page
    if (pathname === '/onboarding' || pathname.startsWith('/onboarding/')) {
      return NextResponse.next();
    }

    // Redirect auth routes to onboarding
    if (AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Redirect other protected routes to onboarding
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    return NextResponse.next();
  }

  // ==========================================
  // 6. Authenticated and onboarding complete
  // ==========================================
  if (isAuthenticated && onboardingCompleted) {
    // Redirect auth routes to intranet
    if (AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL('/intranet', request.url));
    }

    // Redirect onboarding to intranet
    if (pathname === '/onboarding' || pathname.startsWith('/onboarding/')) {
      return NextResponse.redirect(new URL('/intranet', request.url));
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
