import { apiFetch } from '@/lib/api'
import { DEMO_ACCOUNTS } from '@/constants'
import type { LoginPayload, SignupPayload, User } from '@/types'

const SESSION_KEY = 'lifelink_session'
const TOKEN_KEY = 'lifelink_token'

function persistSession(user: User, token?: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token)
  }
}

function clearSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
  window.localStorage.removeItem(TOKEN_KEY)
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: User }> {
    try {
      const data = await apiFetch<{ access_token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      })

      persistSession(data.user, data.access_token)
      return { user: data.user }
    } catch (err: any) {
      // Fallback for demo accounts if backend is unreachable or not seeded
      if (payload.email === DEMO_ACCOUNTS.admin.email && payload.password === DEMO_ACCOUNTS.admin.password) {
        const demoUser: User = {
          id: 'u-admin',
          name: 'Demo Admin',
          email: payload.email,
          role: 'ADMIN',
          joinDate: new Date().toISOString().slice(0, 10),
          status: 'Active',
          isDonor: false,
        }
        persistSession(demoUser)
        return { user: demoUser }
      }
      throw err
    }
  },

  async signup(payload: SignupPayload): Promise<{ user: User }> {
    const data = await apiFetch<{ access_token: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone || '',
        city: payload.city || '',
        blood_group: payload.bloodGroup || '',
        is_donor: payload.intent === 'donate' || payload.intent === 'both',
      }),
    })

    persistSession(data.user, data.access_token)
    return { user: data.user }
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } catch {
      // Ignore network errors on logout
    } finally {
      clearSession()
    }
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

