import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

// Session secret. Because unsigned tokens are just suggestions.
// If this is missing, your auth is broken. Actually, if this is weak, your auth is broken.
// Generate with: openssl rand -base64 32
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'dev-secret-change-in-production'
)

const SESSION_COOKIE_NAME = 'session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days. Because sessions that never expire are a security nightmare.

export interface SessionData {
  userId: string
  email: string
  role: 'user' | 'admin'
  expiresAt: number
}

/**
 * Creates a secure session token. Because sessions are how you know who someone is.
 * Without this, everyone is a stranger and strangers can't be trusted.
 */
export async function createSession(data: Omit<SessionData, 'expiresAt'>): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000

  // Sign the JWT. Because unsigned tokens are just suggestions that anyone can modify.
  // We include expiration because sessions that never expire are a security nightmare.
  const token = await new SignJWT({
    userId: data.userId,
    email: data.email,
    role: data.role,
    expiresAt,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(SECRET)

  return token
}

/**
 * Validates a session token. Because trusting tokens without verification is how you get hacked.
 * Returns null if the session is invalid or expired. Because expired sessions are just expired promises.
 */
export async function validateSession(token: string): Promise<SessionData | null> {
  try {
    // Verify the token signature. Because if we don't verify, anyone can forge sessions.
    const { payload } = await jwtVerify(token, SECRET)
    
    const sessionData = payload as unknown as SessionData
    
    // Double-check expiration. Because defense in depth means checking twice and trusting once.
    // JWT expiration is checked by jwtVerify, but we also check our custom expiresAt field.
    // This is paranoid, but paranoia is a feature in security.
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      return null
    }

    return {
      userId: sessionData.userId,
      email: sessionData.email,
      role: sessionData.role,
      expiresAt: sessionData.expiresAt,
    }
  } catch (error) {
    // Invalid token? Return null. Because invalid tokens are just noise.
    return null
  }
}

/**
 * Gets the current session from cookies. Because cookies are where we store sessions.
 * Returns null if no valid session exists. Because not having a session means you're not authenticated.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    // No token? No session. Because you can't validate what doesn't exist.
    return null
  }

  return validateSession(token)
}

/**
 * Sets a session cookie with secure defaults. Because cookie security is not optional.
 * HttpOnly: prevents JavaScript access (XSS protection). Because if JavaScript can read your session,
 * so can any XSS attack, and XSS attacks are everywhere.
 * Secure: only sent over HTTPS (set to false in dev). Because sending sessions over HTTP
 * is like writing your password on a postcard.
 * SameSite: prevents CSRF attacks. Because CSRF attacks are real and SameSite is free protection.
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  const isProduction = process.env.NODE_ENV === 'production'

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // Critical: prevents XSS. Because if JS can't read it, attackers can't steal it.
    secure: isProduction, // Only HTTPS in production. Because HTTP is for development, not production.
    sameSite: 'lax', // CSRF protection. Because CSRF attacks are real and this is free defense.
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * Deletes the session cookie. Because logout means the session is over.
 * If we don't delete it, the session lives on, and that's not how logout works.
 */
export async function deleteSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

