'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from './Logo'
import { Btn } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/find-donors', label: 'Find Donors' },
  { href: '/how-it-works', label: 'How It Works' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E4E2DF]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === href ? 'text-[#C41230] bg-[#FFF1F2]' : 'text-[#6B6866] hover:text-[#1A1818] hover:bg-[#F5F3F0]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/dashboard' ? 'text-[#C41230] bg-[#FFF1F2]' : 'text-[#6B6866] hover:text-[#1A1818] hover:bg-[#F5F3F0]'
                }`}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-[#6B6866] hover:text-[#1A1818] hover:bg-[#F5F3F0] rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Btn variant="ghost" size="sm" onClick={() => router.push('/login')}>
                Login
              </Btn>
              <Btn variant="primary" size="sm" onClick={() => router.push('/signup')}>
                Sign Up
              </Btn>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-[#F5F3F0] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-0.5 bg-[#1A1818] transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-[#1A1818] transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-[#1A1818] transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E4E2DF] bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#6B6866] hover:text-[#1A1818] hover:bg-[#F5F3F0] rounded-lg"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#E4E2DF] flex gap-2">
            {isLoggedIn ? (
              <>
                <Btn variant="outline" size="sm" className="flex-1" onClick={() => { router.push('/dashboard'); setMobileOpen(false) }}>
                  Dashboard
                </Btn>
                <Btn variant="ghost" size="sm" className="flex-1" onClick={handleLogout}>
                  Logout
                </Btn>
              </>
            ) : (
              <>
                <Btn variant="outline" size="sm" className="flex-1" onClick={() => { router.push('/login'); setMobileOpen(false) }}>
                  Login
                </Btn>
                <Btn variant="primary" size="sm" className="flex-1" onClick={() => { router.push('/signup'); setMobileOpen(false) }}>
                  Sign Up
                </Btn>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
