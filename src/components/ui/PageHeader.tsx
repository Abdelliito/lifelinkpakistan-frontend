import { type ReactNode } from 'react'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1818] font-display">{title}</h1>
        {subtitle && <p className="text-sm text-[#6B6866] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
