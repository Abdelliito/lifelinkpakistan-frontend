'use client'

import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

// ── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1818]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-10 px-3 bg-white border rounded-lg text-sm text-[#1A1818] placeholder:text-[#B0ADA6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C41230]/20 focus:border-[#C41230]',
            error ? 'border-[#C41230]' : 'border-[#E4E2DF]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#C41230]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9B9794]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#1A1818]">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'h-10 px-3 bg-white border rounded-lg text-sm text-[#1A1818] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C41230]/20 focus:border-[#C41230] appearance-none cursor-pointer',
            error ? 'border-[#C41230]' : 'border-[#E4E2DF]',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[#C41230]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9B9794]">{hint}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// ── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={areaId} className="text-sm font-medium text-[#1A1818]">
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          className={cn(
            'px-3 py-2.5 bg-white border rounded-lg text-sm text-[#1A1818] placeholder:text-[#B0ADA6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C41230]/20 focus:border-[#C41230] resize-none',
            error ? 'border-[#C41230]' : 'border-[#E4E2DF]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#C41230]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#9B9794]">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ── Toggle Switch ────────────────────────────────────────────────────────────

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#C41230]/20 focus:ring-offset-1',
          checked ? 'bg-[#C41230]' : 'bg-[#D1CFC9]'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform',
            checked && 'translate-x-4'
          )}
        />
      </button>
      {label && <span className="text-sm font-medium text-[#1A1818]">{label}</span>}
    </label>
  )
}
