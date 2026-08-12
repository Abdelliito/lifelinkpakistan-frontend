'use client'

import { useEffect, useState } from 'react'
import { PageHeader, Select, BloodBadge, StatusBadge, EmptyState } from '@/components/ui'
import { TableRowSkeleton } from '@/components/ui/Feedback'
import { adminService } from '@/services/admin.service'
import { REQUEST_STATUSES } from '@/constants'
import { formatDate } from '@/lib/utils'
import type { BloodRequest, RequestStatus } from '@/types'

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    adminService.getRequests().then((data) => {
      setRequests(data)
      setLoading(false)
    })
  }, [])

  const filtered = requests.filter((r) => !statusFilter || r.status === statusFilter)

  const handleStatusChange = async (id: string, status: RequestStatus) => {
    setUpdatingId(id)
    const updated = await adminService.updateRequestStatus(id, status)
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
    setUpdatingId(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <PageHeader title="Blood Requests" subtitle="Monitor and manage all platform requests" />

      <div className="mb-6">
        <Select
          placeholder="All statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={REQUEST_STATUSES.map((s) => ({ value: s, label: s }))}
          className="sm:max-w-[220px]"
        />
      </div>

      <div className="bg-white border border-[#E4E2DF] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F6F4] border-b border-[#E4E2DF]">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[#9B9794]">
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Blood</th>
              <th className="px-4 py-3 hidden sm:table-cell">Hospital / City</th>
              <th className="px-4 py-3">Urgency</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E2DF]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState icon="🩸" title="No requests found" body="Try a different status filter." />
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8F6F4] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1A1818]">{r.patientName}</td>
                  <td className="px-4 py-3">
                    <BloodBadge group={r.bloodGroup} />
                  </td>
                  <td className="px-4 py-3 text-[#6B6866] hidden sm:table-cell">
                    {r.hospital}, {r.city}
                    <div className="text-[10px] text-[#9B9794]">{formatDate(r.createdAt)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.urgency} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={r.status}
                      disabled={updatingId === r.id}
                      onChange={(e) => handleStatusChange(r.id, e.target.value as RequestStatus)}
                      className="text-xs border border-[#E4E2DF] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#C41230]/20 cursor-pointer disabled:opacity-50"
                    >
                      {REQUEST_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
