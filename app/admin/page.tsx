'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  role: string
}

// Admin page. Because admins need somewhere to go, and regular users shouldn't be able to access it.
// This is protected by both middleware (server-side) and client-side role checks.
export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check session and role on mount. Because we need to verify the user is both authenticated AND an admin.
  // Middleware protects the route, but we also check client-side for better UX and defense in depth.
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          // Not authenticated? Redirect to login. Because you can't access admin pages if you're not logged in.
          router.push('/login')
          return
        }
        if (data.user.role !== 'admin') {
          // Not an admin? Redirect to dashboard. Because admin pages are for admins, not regular users.
          router.push('/dashboard')
          return
        }
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => {
        // Error fetching session? Redirect to login. Because errors mean something went wrong.
        router.push('/login')
      })
  }, [router])

  if (loading) {
    return <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ color: '#fff' }}>Admin Panel</h1>
        <Link
          href="/dashboard"
          style={{
            padding: '0.5rem 1rem',
            background: '#333',
            color: 'white',
            borderRadius: '4px',
            border: '1px solid #444',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#444')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#333')}
        >
          Back to Dashboard
        </Link>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#2a1f0f',
          border: '1px solid #4a3a1f',
          borderRadius: '8px',
        }}
      >
        <p style={{ color: '#ffd700' }}>
          <strong>Admin Access Confirmed</strong>
        </p>
        <p style={{ marginTop: '0.5rem', color: '#e0d0a0' }}>
          This page is protected by role-based access control. Only users with
          the "admin" role can access it.
        </p>
      </div>
    </div>
  )
}

