'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Btn, Divider, Alert } from '@/components/ui'
import { Logo } from '@/components/layout/Logo'
import { useAuth } from '@/features/auth/AuthContext'
import { loginSchema, type LoginFormValues } from '@/lib/validations'
import { DEMO_ACCOUNTS } from '@/constants'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError('')
    try {
      const user = await login(values)
      router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="bg-white border border-[#E4E2DF] rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#1A1818] mb-1 font-display">Welcome back</h1>
          <p className="text-sm text-[#9B9794] mb-6">Log in to your LifeLink account</p>

          {serverError && (
            <div className="mb-4">
              <Alert type="error">
                <span>{serverError}</span>
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#1A1818]">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="h-10 px-3 bg-white border border-[#E4E2DF] rounded-lg text-sm text-[#1A1818] placeholder:text-[#B0ADA6] focus:outline-none focus:ring-2 focus:ring-[#C41230]/20 focus:border-[#C41230]"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-[#C41230]">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[#1A1818]">
                  Password
                </label>
                <button type="button" className="text-xs text-[#C41230] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-10 px-3 pr-10 bg-white border border-[#E4E2DF] rounded-lg text-sm text-[#1A1818] placeholder:text-[#B0ADA6] focus:outline-none focus:ring-2 focus:ring-[#C41230]/20 focus:border-[#C41230]"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9B9794] hover:text-[#1A1818]"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#C41230]">{errors.password.message}</p>}
            </div>

            <Btn type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              {isSubmitting ? 'Logging in…' : 'Login'}
            </Btn>
          </form>

          <Divider label="or" />
          <p className="text-sm text-center text-[#6B6866] mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#C41230] font-semibold hover:underline">
              Create one
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-[#E4E2DF]">
            <p className="text-xs text-[#9B9794] text-center mb-2">Demo accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setValue('email', DEMO_ACCOUNTS.user.email)
                  setValue('password', DEMO_ACCOUNTS.user.password)
                }}
                className="text-xs px-2 py-1.5 border border-[#E4E2DF] rounded-lg text-[#6B6866] hover:border-[#C41230] hover:text-[#C41230] transition-colors"
              >
                User account
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('email', DEMO_ACCOUNTS.admin.email)
                  setValue('password', DEMO_ACCOUNTS.admin.password)
                }}
                className="text-xs px-2 py-1.5 border border-[#E4E2DF] rounded-lg text-[#6B6866] hover:border-[#C41230] hover:text-[#C41230] transition-colors"
              >
                Admin account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
