'use client'

import Link from 'next/link'

export function BackLink({ href, label = 'Back' }: { href: string; label?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-sm text-[#9B9794] hover:text-[#1A1818] mb-4 transition-colors w-fit">
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="m15 18-6-6 6-6" />
      </svg>
      {label}
    </Link>
  )
}
