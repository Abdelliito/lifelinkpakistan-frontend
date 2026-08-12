import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div className={cn('bg-white border border-[#E4E2DF] rounded-xl', className)} onClick={onClick}>
      {children}
    </div>
  )
}
