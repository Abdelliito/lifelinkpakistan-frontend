'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, Btn, BloodBadge, StatusBadge, Skeleton, EmptyState } from '@/components/ui'
import { ErrorState } from '@/components/ui/Feedback'
import { BackLink } from '@/components/shared/BackLink'
import { formatDate } from '@/lib/utils'
import { requestService } from '@/services/request.service'
import type { BloodRequest, MatchingDonor } from '@/types'

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [request, setRequest] = useState<BloodRequest | null | undefined>(undefined)
  const [donors, setDonors] = useState<MatchingDonor[]>([])
  const [donorsLoading, setDonorsLoading] = useState(true)

  useEffect(() => {
    let active = true
    requestService.getRequestById(id).then(async (r) => {
      if (!active) return
      setRequest(r)
      if (r) {
        const matches = await requestService.getMatchingDonors(r)
        if (active) setDonors(matches)
      }
      setDonorsLoading(false)
    })
    return () => {
      active = false
    }
  }, [id])

  if (request === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Skeleton className="h-6 w-32 mb-6" />
        <Card className="p-8">
          <Skeleton className="h-16 w-16 rounded-xl mb-4" />
          <Skeleton className="h-5 w-40 mb-2" />
        </Card>
      </div>
    )
  }

  if (request === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <BackLink href="/requests" label="Back to requests" />
        <ErrorState title="Request not found" body="This blood request may have been removed." action={<Btn onClick={() => router.push('/requests')}>Back to Requests</Btn>} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <BackLink href="/requests" label="Back to requests" />

      <Card className="p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <BloodBadge group={request.bloodGroup} large />
            <div>
              <h1 className="text-xl font-bold text-[#1A1818] font-display">{request.patientName}</h1>
              <p className="text-sm text-[#9B9794]">
                {request.hospital} · {request.city}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <StatusBadge status={request.urgency} />
          <StatusBadge status={request.status} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#F8F6F4] rounded-lg">
            <p className="text-xs text-[#9B9794] mb-1">Contact Number</p>
            <p className="text-sm font-semibold text-[#1A1818]">{request.contactNumber}</p>
          </div>
          <div className="p-4 bg-[#F8F6F4] rounded-lg">
            <p className="text-xs text-[#9B9794] mb-1">Created</p>
            <p className="text-sm font-semibold text-[#1A1818]">{formatDate(request.createdAt)}</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1818] mb-4 font-display">Matching Donors</h2>
        {donorsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : donors.length === 0 ? (
          <EmptyState icon="🔍" title="No matching donors found" body="No compatible donors are currently listed in this city. Check back soon or broaden your search." />
        ) : (
          <div className="space-y-3">
            {donors.map((d) => (
              <Card key={d.id} className="p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#F5F3F0] flex items-center justify-center font-semibold text-[#6B6866] text-sm shrink-0">
                  {d.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1818] text-sm">{d.name}</p>
                  <p className="text-xs text-[#9B9794]">{d.city}</p>
                </div>
                <BloodBadge group={d.bloodGroup} />
                <StatusBadge status={d.availability} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
