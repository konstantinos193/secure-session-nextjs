'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Login page. Because users need a way to log in, and if they can't log in, you have no users.
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle login form submission. Because forms need handlers, and login forms need to actually log users in.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Send credentials to login endpoint. Because that's how authentication works.
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Login failed. Show error. Because users need to know when something goes wrong.
        setError(data.error || 'Login failed')
        return
      }

      // Redirect to dashboard on success. Because successful login means you should see the dashboard,
      // not stay on the login page. That would be confusing.
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      // Network error or something else went wrong. Because errors happen, and we need to handle them.
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false) // Always stop loading. Because loading states that never stop are confusing.
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        background: '#000',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          border: '1px solid #333',
          borderRadius: '8px',
          background: '#111',
        }}
      >
        <h1 style={{ marginBottom: '1.5rem', color: '#fff' }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '0.5rem', color: '#e0e0e0' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #333',
                borderRadius: '4px',
                background: '#000',
                color: '#fff',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '0.5rem', color: '#e0e0e0' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #333',
                borderRadius: '4px',
                background: '#000',
                color: '#fff',
                fontSize: '1rem',
              }}
            />
          </div>
          {error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.5rem',
                background: '#3a1f1f',
                color: '#ff6b6b',
                borderRadius: '4px',
                border: '1px solid #5a2f2f',
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#333' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#888' }}>
          <p>Demo credentials:</p>
          <p>User: user@example.com / password</p>
          <p>Admin: admin@example.com / admin</p>
        </div>
      </div>
    </div>
  )
}

