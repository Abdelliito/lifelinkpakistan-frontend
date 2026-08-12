import type { BloodGroup } from '@/types'

// ── Blood Group Badge ───────────────────────────────────────────────────────

const bgColors: Record<string, string> = {
  'A+': '#EFF6FF',
  'A-': '#EFF6FF',
  'B+': '#F0FDF4',
  'B-': '#F0FDF4',
  'AB+': '#FAF5FF',
  'AB-': '#FAF5FF',
  'O+': '#FFF7ED',
  'O-': '#FFF7ED',
}
const textColors: Record<string, string> = {
  'A+': '#1D4ED8',
  'A-': '#1D4ED8',
  'B+': '#15803D',
  'B-': '#15803D',
  'AB+': '#7C3AED',
  'AB-': '#7C3AED',
  'O+': '#C2410C',
  'O-': '#C2410C',
}

export function BloodBadge({ group, large }: { group: BloodGroup; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-lg ${large ? 'text-2xl w-16 h-16' : 'text-sm w-12 h-8'}`}
      style={{ background: bgColors[group] ?? '#FFF1F2', color: textColors[group] ?? '#C41230' }}
    >
      {group}
    </span>
  )
}

// ── Status Badge ─────────────────────────────────────────────────────────────

export type StatusType =
  | 'Available'
  | 'Unavailable'
  | 'Open'
  | 'Matching Donors Found'
  | 'Completed'
  | 'Closed'
  | 'Critical'
  | 'Urgent'
  | 'Normal'
  | 'Active'
  | 'Suspended'

const statusStyles: Record<StatusType, string> = {
  Available: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
  Unavailable: 'bg-[#F9F7F5] text-[#9B9794] border border-[#E4E2DF]',
  Open: 'bg-[#FFF1F2] text-[#C41230] border border-[#FECDD3]',
  'Matching Donors Found': 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
  Completed: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
  Closed: 'bg-[#F9F7F5] text-[#9B9794] border border-[#E4E2DF]',
  Critical: 'bg-[#FFF1F2] text-[#C41230] border border-[#FECDD3]',
  Urgent: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
  Normal: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
  Active: 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]',
  Suspended: 'bg-[#FFF1F2] text-[#C41230] border border-[#FECDD3]',
}

export function StatusBadge({ status }: { status: StatusType }) {
  const hasDot = ['Available', 'Open', 'Critical'].includes(status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] ?? 'bg-gray-100 text-gray-600 border border-gray-200'}`}
    >
      {hasDot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current"
          style={{ animation: status === 'Available' ? 'pulse-dot 2s ease infinite' : undefined }}
        />
      )}
      {status}
    </span>
  )
}
