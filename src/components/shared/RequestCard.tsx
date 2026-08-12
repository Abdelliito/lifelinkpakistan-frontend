'use client'

import Link from 'next/link'
import { Card, BloodBadge, StatusBadge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { BloodRequest } from '@/types'

export function RequestCard({ request }: { request: BloodRequest }) {
  return (
    <Link href={`/requests/${request.id}`}>
      <Card className="p-5 hover:border-[#C41230] transition-colors cursor-pointer">
        <div className="flex items-start gap-4">
          <BloodBadge group={request.bloodGroup} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-[#1A1818] text-sm">{request.patientName}</p>
              <StatusBadge status={request.urgency} />
            </div>
            <p className="text-xs text-[#9B9794] mt-0.5">
              {request.hospital} · {request.city}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={request.status} />
              <span className="text-xs text-[#9B9794]">{formatDate(request.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
