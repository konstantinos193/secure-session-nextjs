import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateSession } from '@/lib/session'

/**
 * Middleware for route protection. Because not protecting routes is how you get hacked.
 * 
 * This runs on every request and checks for valid sessions. Because checking on every request
 * is how you ensure security. If we only checked sometimes, attackers would find the times we don't.
 * Protected routes require authentication. Admin routes require admin role.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes - no authentication required. Because login pages need to be accessible
  // to people who aren't logged in. Otherwise, how would they log in?
  const publicRoutes = ['/login', '/api/auth/login']
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get session token from cookie. Because cookies are where we store sessions.
  const token = request.cookies.get('session')?.value

  if (!token) {
    // No token? No access. Because if you don't have a session, you're not authenticated.
    // Redirect to login if not authenticated. Because we can't let unauthenticated users
    // access protected routes. That would defeat the purpose of authentication.
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Validate session. Because trusting tokens without validation is how you get hacked.
  const session = await validateSession(token)

  if (!session) {
    // Invalid or expired session. Because invalid sessions are just noise, and expired sessions
    // are expired promises. We delete the cookie because keeping invalid cookies is confusing.
    const response = pathname.startsWith('/api')
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url))
    
    response.cookies.delete('session')
    return response
  }

  // Check admin routes. Because admin routes should only be accessible to admins.
  // If we don't check roles, regular users could access admin routes, and that's a security issue.
  if (pathname.startsWith('/admin')) {
    if (session.role !== 'admin') {
      // Not an admin? No access. Because admin routes are for admins, not regular users.
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

