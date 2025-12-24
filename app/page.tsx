import Link from 'next/link'

// Home page. Because every app needs a home page, and this is it.
// It's simple because this is a reference implementation, not a full app.
export default function HomePage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Secure Session Next.js</h1>
      <p style={{ marginTop: '1rem', marginBottom: '2rem', color: '#a0a0a0' }}>
        Minimal, correct session & cookie handling for Next.js.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link
          href="/login"
          style={{
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: 'white',
            borderRadius: '4px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Login
        </Link>
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
          Dashboard (Protected)
        </Link>
      </div>
    </div>
  )
}

