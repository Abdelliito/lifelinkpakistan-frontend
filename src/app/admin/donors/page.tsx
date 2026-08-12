'use client'

import { useEffect, useState } from 'react'
import { PageHeader, Input, Select, BloodBadge, StatusBadge, EmptyState } from '@/components/ui'
import { TableRowSkeleton } from '@/components/ui/Feedback'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { adminService } from '@/services/admin.service'
import { BLOOD_GROUPS, CITIES } from '@/constants'
import type { Donor } from '@/types'

export default function AdminDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [bloodFilter, setBloodFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [toDelete, setToDelete] = useState<Donor | null>(null)

  const load = () => {
    setLoading(true)
    adminService.getDonors().then((data) => {
      setDonors(data)
      setLoading(false)
    })
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
  useEffect(load, [])

  const filtered = donors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchesBlood = !bloodFilter || d.bloodGroup === bloodFilter
    const matchesCity = !cityFilter || d.city === cityFilter
    return matchesSearch && matchesBlood && matchesCity
  })

  const handleDelete = async () => {
    if (!toDelete) return
    await adminService.deleteDonor(toDelete.id)
    setDonors((prev) => prev.filter((d) => d.id !== toDelete.id))
    setToDelete(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <PageHeader title="Donors" subtitle="Manage registered blood donors" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select placeholder="All blood groups" value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))} className="sm:max-w-[160px]" />
        <Select placeholder="All cities" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} options={CITIES.map((c) => ({ value: c, label: c }))} className="sm:max-w-[160px]" />
      </div>

      <div className="bg-white border border-[#E4E2DF] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F6F4] border-b border-[#E4E2DF]">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[#9B9794]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Blood Group</th>
              <th className="px-4 py-3 hidden sm:table-cell">City</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E2DF]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState icon="🩸" title="No donors found" body="Try adjusting your filters." />
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="hover:bg-[#F8F6F4] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1A1818]">{d.name}</td>
                  <td className="px-4 py-3">
                    <BloodBadge group={d.bloodGroup} />
                  </td>
                  <td className="px-4 py-3 text-[#6B6866] hidden sm:table-cell">{d.city}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.availability} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setToDelete(d)} className="text-xs font-semibold text-[#C41230] hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {toDelete && (
        <ConfirmModal
          icon="🗑️"
          title="Remove this donor?"
          body={
            <>
              This will remove <strong>{toDelete.name}</strong> from the donor directory. This action cannot be undone.
            </>
          }
          confirmLabel="Remove Donor"
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
