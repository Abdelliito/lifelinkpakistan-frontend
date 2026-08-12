'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, Btn, BloodBadge, StatusBadge, Skeleton, Alert } from '@/components/ui'
import { BackLink } from '@/components/shared/BackLink'
import { ErrorState } from '@/components/ui/Feedback'
import { donorService } from '@/services/donor.service'
import type { Donor } from '@/types'

export default function DonorDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [donor, setDonor] = useState<Donor | null | undefined>(undefined)
  const [contacted, setContacted] = useState(false)
  const [reported, setReported] = useState(false)

  useEffect(() => {
    let active = true
    donorService.getDonorById(id).then((d) => {
      if (active) setDonor(d)
    })
    return () => {
      active = false
    }
  }, [id])

  if (donor === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Skeleton className="h-6 w-32 mb-6" />
        <Card className="p-8">
          <Skeleton className="h-16 w-16 rounded-xl mb-4" />
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </Card>
      </div>
    )
  }

  if (donor === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <BackLink href="/find-donors" label="Back to search" />
        <ErrorState title="Donor not found" body="This donor profile may have been removed." action={<Btn onClick={() => router.push('/find-donors')}>Back to Search</Btn>} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <BackLink href="/find-donors" label="Back to search" />

      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F3F0] flex items-center justify-center font-bold text-[#6B6866] text-xl">
              {donor.initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1A1818] font-display">{donor.name}</h1>
              <p className="text-sm text-[#9B9794]">{donor.city}</p>
            </div>
          </div>
          <BloodBadge group={donor.bloodGroup} large />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-[#F8F6F4] rounded-lg">
            <p className="text-xs text-[#9B9794] mb-1">Availability</p>
            <StatusBadge status={donor.availability} />
          </div>
          <div className="p-4 bg-[#F8F6F4] rounded-lg">
            <p className="text-xs text-[#9B9794] mb-1">Last Donation</p>
            <p className="text-sm font-semibold text-[#1A1818]">{donor.lastDonation}</p>
          </div>
        </div>

        {donor.availability === 'Unavailable' && (
          <div className="mb-6">
            <Alert type="warning">This donor is currently unavailable. You may still contact them, but response times may be longer.</Alert>
          </div>
        )}

        {contacted ? (
          <div className="mb-6">
            <Alert type="success">
              Contact request sent to {donor.name}. In a real deployment this would notify the donor directly — for now,
              their masked number is: <strong>{donor.phone}</strong>
            </Alert>
          </div>
        ) : (
          <Btn variant="primary" className="w-full mb-3" onClick={() => setContacted(true)}>
            Contact Donor
          </Btn>
        )}

        {reported ? (
          <p className="text-xs text-center text-[#9B9794]">Thank you — this profile has been flagged for review.</p>
        ) : (
          <button onClick={() => setReported(true)} className="w-full text-xs text-[#9B9794] hover:text-[#C41230] transition-colors">
            Report this profile
          </button>
        )}
      </Card>

      <p className="text-xs text-[#9B9794] text-center mt-4">
        For privacy, full contact details are only shared once a donor accepts a contact request.
      </p>
    </div>
  )
}
