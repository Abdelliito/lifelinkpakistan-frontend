import { type ReactNode } from 'react'
import { Card } from './Card'

// ── Alert Banner ─────────────────────────────────────────────────────────────

export type AlertType = 'success' | 'error' | 'warning' | 'emergency' | 'info'

const alertStyles: Record<AlertType, string> = {
  success: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]',
  error: 'bg-[#FFF1F2] border-[#FECDD3] text-[#C41230]',
  warning: 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]',
  emergency: 'bg-[#FFF1F2] border-[#C41230] text-[#C41230]',
  info: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]',
}

const alertIcons: Record<AlertType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  emergency: '🚨',
  info: 'ℹ',
}

export function Alert({ type, children }: { type: AlertType; children: ReactNode }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm font-medium ${alertStyles[type]}`}>
      <span className="mt-0.5 shrink-0">{alertIcons[type]}</span>
      <div>{children}</div>
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />
}

export function DonorCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16 mt-3" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </Card>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

// ── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: string
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-[#1A1818] mb-2 font-display">{title}</h3>
      <p className="text-sm text-[#6B6866] max-w-xs mb-6">{body}</p>
      {action}
    </div>
  )
}

// ── Error State ──────────────────────────────────────────────────────────────

export function ErrorState({
  title = 'Something went wrong',
  body = 'Please try again in a moment.',
  action,
}: {
  title?: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">⚠️</span>
      <h3 className="text-lg font-semibold text-[#1A1818] mb-2 font-display">{title}</h3>
      <p className="text-sm text-[#6B6866] max-w-xs mb-6">{body}</p>
      {action}
    </div>
  )
}
