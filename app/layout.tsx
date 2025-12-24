import type { Metadata } from 'next'
import './globals.css'

// Root layout. Because Next.js needs a root layout, and this is it.
// It's minimal because this is a reference implementation, not a full app.
export const metadata: Metadata = {
  title: 'Secure Session Next.js',
  description: 'Minimal, correct session & cookie handling for Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="dark">{children}</body>
    </html>
  )
}

