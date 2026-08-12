'use client'

import { type ReactNode } from 'react'
import { Btn } from '@/components/ui'

export function ConfirmModal({
  icon = '⚠️',
  title,
  body,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: {
  icon?: string
  title: string
  body: ReactNode
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-[#FFF1F2] rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">{icon}</div>
        <h3 className="text-lg font-bold text-[#1A1818] text-center mb-2 font-display">{title}</h3>
        <div className="text-sm text-[#6B6866] text-center mb-6">{body}</div>
        <div className="flex gap-3">
          <Btn variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Btn>
          <Btn variant="primary" className="flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  )
}
