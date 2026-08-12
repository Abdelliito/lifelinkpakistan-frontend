'use client'

import { useEffect, useState } from 'react'
import { PageHeader, StatCard, Card, StatusBadge, BloodBadge, Skeleton } from '@/components/ui'
import { adminService } from '@/services/admin.service'
import { formatDate } from '@/lib/utils'
import type { BloodRequest } from '@/types'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{ totalUsers: number; totalDonors: number; availableDonors: number; activeRequests: number } | null>(null)
  const [recent, setRecent] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getRequests()]).then(([s, requests]) => {
      setStats(s)
      setRecent(requests.slice(0, 5))
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <PageHeader title="Admin Overview" subtitle="Platform-wide activity and statistics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatCard label="Total Users" value={stats.totalUsers.toString()} />
            <StatCard label="Total Donors" value={stats.totalDonors.toString()} />
            <StatCard label="Available Donors" value={stats.availableDonors.toString()} accent />
            <StatCard label="Active Requests" value={stats.activeRequests.toString()} />
          </>
        )}
      </div>

      <Card className="p-6">
        <h2 className="font-bold text-[#1A1818] text-sm uppercase tracking-wider mb-4 font-display">Recent Activity</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-3 border border-[#E4E2DF] rounded-lg">
                <BloodBadge group={r.bloodGroup} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1818] truncate">{r.patientName}</p>
                  <p className="text-xs text-[#9B9794]">
                    {r.hospital} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
