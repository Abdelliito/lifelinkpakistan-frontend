'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Btn, Input, Divider, Alert } from '@/components/ui'
import { Logo } from '@/components/layout/Logo'
import { useAuth } from '@/features/auth/AuthContext'
import { signupSchema, type SignupFormValues } from '@/lib/validations'

const intentOptions: { id: 'find' | 'donate' | 'both'; label: string; desc: string }[] = [
  { id: 'find', label: 'Find Blood', desc: 'Search and request donors' },
  { id: 'donate', label: 'Become a Donor', desc: 'Register as a blood donor' },
  { id: 'both', label: 'Both', desc: 'Find donors and donate' },
]

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { intent: 'both' },
  })

  const intent = watch('intent')

  const onSubmit = async (values: SignupFormValues) => {
    setFormError('')
    setLoading(true)
    try {
      await signup(values)
      router.push(values.intent === 'donate' || values.intent === 'both' ? '/donor' : '/dashboard')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6F4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="bg-white border border-[#E4E2DF] rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#1A1818] mb-1 font-display">Create account</h1>
          <p className="text-sm text-[#9B9794] mb-6">Join Pakistan&apos;s blood donor network</p>

          {formError && (
            <div className="mb-4">
              <Alert type="error">
                <span>{formError}</span>
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" placeholder="Ahmed Raza" error={errors.name?.message} {...register('name')} />
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1818]">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className={`w-full h-10 px-3 pr-10 bg-white border rounded-lg text-sm text-[#1A1818] placeholder:text-[#B0ADA6] focus:outline-none focus:ring-2 focus:ring-[#C41230]/20 focus:border-[#C41230] ${errors.password ? 'border-[#C41230]' : 'border-[#E4E2DF]'}`}
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9B9794]">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#C41230]">{errors.password.message}</p>}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div>
              <p className="text-sm font-medium text-[#1A1818] mb-2">How would you like to use LifeLink?</p>
              <div className="grid grid-cols-3 gap-2">
                {intentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setValue('intent', opt.id)}
                    className={`flex flex-col items-center p-3 rounded-lg border text-center transition-all ${
                      intent === opt.id ? 'border-[#C41230] bg-[#FFF1F2]' : 'border-[#E4E2DF] bg-white hover:border-[#D1CFC9]'
                    }`}
                  >
                    <span className={`text-xs font-semibold ${intent === opt.id ? 'text-[#C41230]' : 'text-[#1A1818]'}`}>{opt.label}</span>
                    <span className="text-[10px] text-[#9B9794] mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <Btn type="submit" variant="primary" className="w-full" loading={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Btn>
          </form>

          <p className="text-xs text-[#9B9794] text-center mt-4">
            By creating an account you agree to our{' '}
            <span className="text-[#C41230] cursor-pointer hover:underline">Terms</span> and{' '}
            <span className="text-[#C41230] cursor-pointer hover:underline">Privacy Policy</span>.
          </p>

          <Divider label="or" />
          <p className="text-sm text-center text-[#6B6866] mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#C41230] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
