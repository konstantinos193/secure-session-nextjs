import { NextResponse } from 'next/server'

/**
 * Logout endpoint. Because logout is how users end their session.
 * Deletes the session cookie. Because if we don't delete it, the session lives on,
 * and that's not how logout works. Logout means the session is over.
 */
export async function POST() {
  const response = NextResponse.json({ success: true })
  // Delete the session cookie. Because logout means the session is over.
  response.cookies.delete('session')

  return response
}

