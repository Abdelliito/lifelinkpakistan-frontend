'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader, Btn, EmptyState, ErrorState } from '@/components/ui'
import { Skeleton } from '@/components/ui/Feedback'
import { RequestCard } from '@/components/shared/RequestCard'
import { useAuth } from '@/features/auth/AuthContext'
import { requestService } from '@/services/request.service'
import type { BloodRequest } from '@/types'

export default function RequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const data = await requestService.getRequests(user.id)
      setRequests(data)
    } catch {
      setError('Could not load your requests right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <PageHeader
        title="Blood Requests"
        subtitle="Track your emergency blood requests"
        action={
          <Link href="/requests/new">
            <Btn variant="primary">+ New Request</Btn>
          </Link>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState body={error} action={<Btn onClick={load}>Try Again</Btn>} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon="🩸"
          title="No blood requests"
          body="You haven't created any blood requests yet. Create one to find compatible donors quickly."
          action={
            <Link href="/requests/new">
              <Btn>Create Request</Btn>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </div>
  )
}
