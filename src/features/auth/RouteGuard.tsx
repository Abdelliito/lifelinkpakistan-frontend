'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

/**
 * Wraps a page that requires a logged-in user. This is a FRONTEND-ONLY
 * convenience redirect — it does not provide real security, since all
 * checks happen client-side against mock session data. A real backend
 * must still enforce authorization server-side.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login')
    }
  }, [isLoading, isLoggedIn, router])

  if (isLoading || !isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C41230] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login')
    } else if (!isLoading && isLoggedIn && !isAdmin) {
      router.replace('/dashboard')
    }
  }, [isLoading, isLoggedIn, isAdmin, router])

  if (isLoading || !isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C41230] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
