'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader, Select, Btn, EmptyState, ErrorState } from '@/components/ui'
import { DonorCard } from '@/components/shared/DonorCard'
import { DonorCardSkeleton } from '@/components/ui/Feedback'
import { BLOOD_GROUPS, CITIES } from '@/constants'
import { donorService, type DonorSearchFilters } from '@/services/donor.service'
import type { Donor, BloodGroup, City, DonorAvailability } from '@/types'

function FindDonorsContent() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<DonorSearchFilters>({
    bloodGroup: (searchParams.get('bloodGroup') as BloodGroup) || '',
    city: (searchParams.get('city') as City) || '',
    availability: '',
  })
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const runSearch = async (f: DonorSearchFilters) => {
    setLoading(true)
    setError('')
    try {
      const results = await donorService.searchDonors(f)
      setDonors(results)
    } catch {
      setError('Something went wrong while searching for donors.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    runSearch(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (patch: Partial<DonorSearchFilters>) => {
    const next = { ...filters, ...patch }
    setFilters(next)
    runSearch(next)
  }

  const clearFilters = () => {
    const next: DonorSearchFilters = { bloodGroup: '', city: '', availability: '' }
    setFilters(next)
    runSearch(next)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <PageHeader title="Find Donors" subtitle="Search verified blood donors by group, city, and availability" />

      {/* Filters */}
      <div className="bg-white border border-[#E4E2DF] rounded-xl p-5 mb-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <Select
            label="Blood Group"
            value={filters.bloodGroup}
            onChange={(e) => handleFilterChange({ bloodGroup: e.target.value as BloodGroup })}
            placeholder="All blood groups"
            options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
          />
          <Select
            label="City"
            value={filters.city}
            onChange={(e) => handleFilterChange({ city: e.target.value as City })}
            placeholder="All cities"
            options={CITIES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="Availability"
            value={filters.availability}
            onChange={(e) => handleFilterChange({ availability: e.target.value as DonorAvailability })}
            placeholder="Any availability"
            options={[
              { value: 'Available', label: 'Available' },
              { value: 'Unavailable', label: 'Unavailable' },
            ]}
          />
        </div>
        {(filters.bloodGroup || filters.city || filters.availability) && (
          <button onClick={clearFilters} className="text-xs text-[#C41230] font-semibold mt-3 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <DonorCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState body={error} action={<Btn onClick={() => runSearch(filters)}>Try Again</Btn>} />
      ) : donors.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No donors found"
          body="Try changing your blood group or city filters."
          action={
            <Btn variant="outline" onClick={clearFilters}>
              Adjust Search
            </Btn>
          }
        />
      ) : (
        <>
          <p className="text-sm text-[#9B9794] mb-4">{donors.length} donors found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function FindDonorsPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-10 text-sm text-[#9B9794]">Loading…</div>}>
      <FindDonorsContent />
    </Suspense>
  )
}
