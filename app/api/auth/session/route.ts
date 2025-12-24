import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

/**
 * Session endpoint. Because sometimes you need to check if someone is logged in.
 * Returns the current session data if authenticated. Because knowing who someone is
 * is useful for displaying user-specific content and checking permissions.
 */
export async function GET() {
  const session = await getSession()

  if (!session) {
    // No session? Not authenticated. Because you can't be authenticated without a session.
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  // Return session data. But we don't return everything. Because some session data
  // is internal and shouldn't be exposed to clients. We only return what's needed.
  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      email: session.email,
      role: session.role,
    },
  })
}

