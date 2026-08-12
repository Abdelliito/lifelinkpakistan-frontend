'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService } from '@/services/auth.service'
import type { LoginPayload, SignupPayload, User } from '@/types'

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<User>
  signup: (payload: SignupPayload) => Promise<User>
  logout: () => Promise<void>
  updateUser: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate mock session from localStorage on mount
    setUser(authService.getCurrentUser())
    setIsLoading(false)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const { user: loggedInUser } = await authService.login(payload)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const signup = useCallback(async (payload: SignupPayload) => {
    const { user: newUser } = await authService.signup(payload)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback((patch: Partial<User>) => {
    const updated = authService.updateCurrentUser(patch)
    setUser(updated)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
