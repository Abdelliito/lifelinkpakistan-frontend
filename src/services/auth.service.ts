import { mockUsers } from '@/data/users'
import { DEMO_ACCOUNTS, MOCK_DELAY } from '@/constants'
import { delay, genId } from '@/lib/utils'
import type { LoginPayload, SignupPayload, User } from '@/types'

/**
 * FRONTEND-ONLY MOCK AUTH SERVICE
 * ---------------------------------------------------------------------------
 * This simulates authentication using an in-memory user list and
 * localStorage for session persistence across page refreshes. There is
 * NO real password hashing, NO server verification, and NO security
 * guarantee. It exists purely so the UI has something realistic to call.
 * Swap this file's internals for real API calls when a backend exists —
 * the function signatures are designed to make that swap painless.
 */

const SESSION_KEY = 'lifelink_session'

// In-memory "database" of users for this session (mutated on signup)
let users: User[] = [...mockUsers]

function persistSession(user: User) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function clearSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: User }> {
    await delay(MOCK_DELAY.medium)

    if (!payload.email || !payload.password) {
      throw new Error('Please fill in all fields.')
    }

    // Demo admin account
    if (payload.email === DEMO_ACCOUNTS.admin.email && payload.password === DEMO_ACCOUNTS.admin.password) {
      const admin = users.find((u) => u.role === 'ADMIN')!
      persistSession(admin)
      return { user: admin }
    }

    // Demo regular user account
    if (payload.email === DEMO_ACCOUNTS.user.email && payload.password === DEMO_ACCOUNTS.user.password) {
      const user = users.find((u) => u.email === DEMO_ACCOUNTS.user.email)!
      persistSession(user)
      return { user }
    }

    // Any other matching email in the mock directory (password is not actually checked
    // beyond presence, since there is no real backend / hashing here)
    const found = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase())
    if (found) {
      persistSession(found)
      return { user: found }
    }

    throw new Error('No account found with that email. Try signing up first.')
  },

  async signup(payload: SignupPayload): Promise<{ user: User }> {
    await delay(MOCK_DELAY.long)

    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }

    const newUser: User = {
      id: genId('u'),
      name: payload.name,
      email: payload.email,
      role: payload.intent === 'donate' || payload.intent === 'both' ? 'DONOR' : 'USER',
      joinDate: new Date().toISOString().slice(0, 10),
      status: 'Active',
      isDonor: payload.intent === 'donate' || payload.intent === 'both',
    }
    users = [...users, newUser]
    persistSession(newUser)
    return { user: newUser }
  },

  async logout(): Promise<void> {
    await delay(MOCK_DELAY.short / 2)
    clearSession()
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  },

  updateCurrentUser(patch: Partial<User>) {
    const current = authService.getCurrentUser()
    if (!current) return null
    const updated = { ...current, ...patch }
    persistSession(updated)
    return updated
  },
}
