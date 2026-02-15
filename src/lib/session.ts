import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

// ========================================
// Session Management with Jose
// ========================================

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  user: {
    id: string;
    email: string;
  };
  onboardingCompleted: boolean;
  expiresAt: number;
}

/**
 * Obtiene la secret key para encriptación desde variables de entorno
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Encripta la sesión del usuario usando Jose (JWT)
 */
export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

/**
 * Desencripta y verifica la sesión del usuario
 */
export async function decryptSession(
  session: string | undefined = ""
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
}

/**
 * Crea una nueva sesión encriptada y la guarda en cookies
 */
export async function createSession(
  userId: string,
  email: string,
  onboardingCompleted = false
): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION * 1000;

  const session = await encryptSession({
    user: { id: userId, email },
    onboardingCompleted,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Obtiene la sesión actual desde las cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return decryptSession(session);
}

/**
 * Obtiene la sesión desde un request (para middleware)
 */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return decryptSession(session);
}

/**
 * Actualiza el estado de onboarding en la sesión
 */
export async function updateSessionOnboarding(
  onboardingCompleted: boolean
): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const expiresAt = Date.now() + SESSION_DURATION * 1000;

  const newSession = await encryptSession({
    user: session.user,
    onboardingCompleted,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Elimina la sesión actual (logout)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
