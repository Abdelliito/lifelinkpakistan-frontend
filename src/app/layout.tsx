import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/features/auth/AuthContext'

export const metadata: Metadata = {
  title: 'LifeLink Pakistan — Connecting Blood Donors with Lives in Need',
  description:
    'A trusted platform connecting patients and families with available blood donors across Pakistan — fast, safe, and free.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
