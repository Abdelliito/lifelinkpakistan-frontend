'use client'

import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'emergency'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[#C41230] text-white hover:bg-[#A00E26] focus-visible:outline-[#C41230] active:scale-[0.98]',
  secondary: 'bg-[#1A1818] text-white hover:bg-[#333] focus-visible:outline-[#1A1818] active:scale-[0.98]',
  outline:
    'border border-[#E4E2DF] bg-white text-[#1A1818] hover:border-[#C41230] hover:text-[#C41230] focus-visible:outline-[#C41230]',
  ghost: 'text-[#6B6866] hover:bg-[#F0EDEA] hover:text-[#1A1818] focus-visible:outline-[#C41230]',
  destructive:
    'bg-[#FFF1F2] text-[#C41230] border border-[#FECDD3] hover:bg-[#FFE4E6] focus-visible:outline-[#C41230]',
  emergency:
    'bg-[#C41230] text-white hover:bg-[#A00E26] shadow-lg shadow-red-200 focus-visible:outline-[#C41230] active:scale-[0.98] animate-pulse-subtle',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm h-8',
  md: 'px-4 py-2 text-sm h-9',
  lg: 'px-6 py-3 text-base h-11',
}

export function Btn({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }: BtnProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
