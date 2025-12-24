'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  role: string
}

// Dashboard page. Because users need somewhere to go after they log in.
// This is a protected page - middleware handles the authentication check.
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check session on mount. Because we need to know who the user is to display their dashboard.
  // Middleware protects the route, but we also check client-side for better UX.
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          // Not authenticated? Redirect to login. Because you can't see the dashboard if you're not logged in.
          router.push('/login')
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

  // Handle logout. Because users need a way to log out, and if they can't log out, they're stuck.
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

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
        <h1 style={{ color: '#fff' }}>Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Logout
        </button>
      </div>
      <div
        style={{
          padding: '1.5rem',
          background: '#111',
          border: '1px solid #333',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <p style={{ color: '#e0e0e0', marginBottom: '0.5rem' }}>
          <strong style={{ color: '#fff' }}>Email:</strong> {user.email}
        </p>
        <p style={{ color: '#e0e0e0' }}>
          <strong style={{ color: '#fff' }}>Role:</strong> {user.role}
        </p>
      </div>
      <p style={{ marginBottom: '1rem', color: '#a0a0a0' }}>
        This page is protected by middleware. You can only access it if you have
        a valid session.
      </p>
      {user.role === 'admin' && (
        <div>
          <Link
            href="/admin"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#0070f3',
              color: 'white',
              borderRadius: '4px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Admin Panel
          </Link>
        </div>
      )}
    </div>
  )
}

