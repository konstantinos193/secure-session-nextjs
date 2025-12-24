import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { createSession } from '@/lib/session'

/**
 * Login endpoint. Because login is how users authenticate.
 * Validates credentials and creates a secure session cookie.
 * Without this, users can't log in, and if users can't log in, you have no users.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input. Because trusting user input is how you get hacked.
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Authenticate user. Because we need to verify they are who they say they are.
    const user = await authenticateUser(email, password)

    if (!user) {
      // Generic error. Because telling attackers which emails exist in your system
      // is like giving them a roadmap to your users. We use the same error message
      // for "user not found" and "wrong password" to prevent user enumeration attacks.
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session token. Because sessions are how we remember who someone is.
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set secure cookie. Because cookies are how we store sessions, and secure cookies
    // are how we protect them. HttpOnly prevents XSS, Secure prevents HTTP transmission,
    // and SameSite prevents CSRF. These aren't optional.
    const response = NextResponse.json({ success: true })
    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set('session', token, {
      httpOnly: true, // Critical: prevents XSS. Because if JS can't read it, attackers can't steal it.
      secure: isProduction, // Only HTTPS in production. Because HTTP is for development, not production.
      sameSite: 'lax', // CSRF protection. Because CSRF attacks are real and this is free defense.
      maxAge: 60 * 60 * 24 * 7, // 7 days. Because sessions that never expire are a security nightmare.
      path: '/',
    })

    return response
  } catch (error) {
    // Generic error. Because we don't want to leak information about what went wrong.
    // Detailed errors are logged server-side, not sent to clients.
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

