'use client'

import Link from 'next/link'
import { Btn, Card, BloodBadge, StatusBadge } from '@/components/ui'
import type { Donor } from '@/types'

export function DonorCard({ donor }: { donor: Donor }) {
  return (
    <Link href={`/donor/${donor.id}`}>
      <Card className="p-5 hover:border-[#C41230] hover:shadow-md transition-all duration-150 cursor-pointer group h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F5F3F0] flex items-center justify-center font-semibold text-[#6B6866] text-sm">
              {donor.initials}
            </div>
            <div>
              <p className="font-semibold text-[#1A1818] text-sm">{donor.name}</p>
              <p className="text-xs text-[#9B9794]">{donor.city}</p>
            </div>
          </div>
          <BloodBadge group={donor.bloodGroup} />
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={donor.availability} />
          <span className="text-xs text-[#9B9794]">{donor.lastDonation}</span>
        </div>
        <Btn variant="outline" size="sm" className="w-full mt-4 group-hover:border-[#C41230] group-hover:text-[#C41230]">
          View Donor
        </Btn>
      </Card>
    </Link>
  )
}
