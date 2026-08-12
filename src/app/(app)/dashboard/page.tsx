'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Btn, StatusBadge, BloodBadge, Skeleton } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthContext'
import { useCurrentDonor } from '@/hooks/useCurrentDonor'
import { requestService } from '@/services/request.service'
import type { BloodRequest } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const { donor, loading: donorLoading } = useCurrentDonor()
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [loadingRequests, setLoadingRequests] = useState(true)

  useEffect(() => {
    if (!user) return
    let active = true
    requestService.getRequests(user.id).then((r) => {
      if (active) {
        setRequests(r.slice(0, 2))
        setLoadingRequests(false)
      }
    })
    return () => {
      active = false
    }
  }, [user])

  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1818] font-display">Hello, {firstName} 👋</h1>
        <p className="text-[#9B9794] mt-1 text-sm">What do you need help with today?</p>
      </div>

      {/* Primary Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link
          href="/find-donors"
          className="group bg-white border border-[#E4E2DF] rounded-xl p-6 text-left hover:border-[#C41230] hover:shadow-lg hover:shadow-red-50 transition-all duration-200"
        >
          <div className="w-10 h-10 bg-[#FFF1F2] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#C41230] transition-colors">
            <svg className="group-hover:stroke-white transition-colors" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#C41230" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h3 className="font-bold text-[#1A1818] mb-1 font-display">Find a Donor</h3>
          <p className="text-xs text-[#9B9794]">Search by blood group and city</p>
        </Link>

        <Link href="/requests/new" className="group bg-[#C41230] rounded-xl p-6 text-left hover:bg-[#A00E26] transition-colors shadow-lg shadow-red-200">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl">🚨</span>
          </div>
          <h3 className="font-bold text-white mb-1 font-display">Emergency Request</h3>
          <p className="text-xs text-white/70">Create a blood request now</p>
        </Link>

        <Link
          href={donor ? '/donor/profile' : '/donor'}
          className="group bg-white border border-[#E4E2DF] rounded-xl p-6 text-left hover:border-[#C41230] hover:shadow-lg hover:shadow-red-50 transition-all duration-200"
        >
          <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#15803D] transition-colors">
            <svg className="group-hover:stroke-white transition-colors" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#15803D" strokeWidth={2}>
              <path d="M12 2C12 2 6 7.5 6 12a6 6 0 0012 0C18 7.5 12 2 12 2Z" />
            </svg>
          </div>
          <h3 className="font-bold text-[#1A1818] mb-1 font-display">{donor ? 'Donor Profile' : 'Become a Donor'}</h3>
          <p className="text-xs text-[#9B9794]">{donor ? 'Manage your donor information' : 'Register to start saving lives'}</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donor Status */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="font-bold text-[#1A1818] mb-4 text-sm uppercase tracking-wider font-display">Donor Status</h2>
          {donorLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-14 rounded-xl" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          ) : donor ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#FFF1F2] rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#C41230] font-display">{donor.bloodGroup}</span>
                </div>
                <div>
                  <p className="font-semibold text-[#1A1818] text-sm">{donor.name}</p>
                  <p className="text-xs text-[#9B9794]">{donor.city}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-[#F5F3F0]">
                  <span className="text-[#9B9794]">Availability</span>
                  <StatusBadge status={donor.availability} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#9B9794]">Last donation</span>
                  <span className="font-medium text-[#1A1818] text-xs">{donor.lastDonation}</span>
                </div>
              </div>
              <Link href="/donor/profile">
                <Btn variant="outline" size="sm" className="w-full mt-4">
                  Manage Profile
                </Btn>
              </Link>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">🩸</p>
              <p className="text-sm font-semibold text-[#1A1818]">Not registered as a donor</p>
              <p className="text-xs text-[#9B9794] mt-1 mb-3">Sign up to help patients in your city</p>
              <Link href="/donor">
                <Btn variant="primary" size="sm">
                  Become a Donor
                </Btn>
              </Link>
            </div>
          )}
        </Card>

        {/* Recent Requests */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1A1818] text-sm uppercase tracking-wider font-display">Recent Blood Requests</h2>
            <Link href="/requests" className="text-xs text-[#C41230] font-semibold hover:underline">
              View all
            </Link>
          </div>
          {loadingRequests ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🩸</p>
              <p className="text-sm font-semibold text-[#1A1818]">No requests yet</p>
              <p className="text-xs text-[#9B9794] mt-1">Create a blood request to get started</p>
              <Link href="/requests/new">
                <Btn variant="primary" size="sm" className="mt-3">
                  Create Request
                </Btn>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <Link
                  key={req.id}
                  href={`/requests/${req.id}`}
                  className="w-full flex items-center gap-4 p-3 rounded-lg border border-[#E4E2DF] hover:border-[#C41230] hover:bg-[#FFF8F8] transition-colors text-left"
                >
                  <BloodBadge group={req.bloodGroup} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1818] text-sm truncate">{req.patientName}</p>
                    <p className="text-xs text-[#9B9794]">
                      {req.hospital} · {req.city}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={req.urgency} />
                    <StatusBadge status={req.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <Link href="/requests/ai-assistant" className="flex items-center gap-3 p-4 bg-[#1A1818] rounded-xl text-left hover:bg-[#252323] transition-colors">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-lg shrink-0">✨</div>
          <div>
            <p className="text-sm font-semibold text-white">AI Request Assistant</p>
            <p className="text-xs text-white/50">Describe emergency in plain words</p>
          </div>
          <svg className="ml-auto text-white/30" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
        <Link href="/profile" className="flex items-center gap-3 p-4 bg-white border border-[#E4E2DF] rounded-xl text-left hover:border-[#C41230] transition-colors">
          <div className="w-9 h-9 bg-[#F5F3F0] rounded-lg flex items-center justify-center text-lg shrink-0">⚙️</div>
          <div>
            <p className="text-sm font-semibold text-[#1A1818]">Profile Settings</p>
            <p className="text-xs text-[#9B9794]">Manage your account</p>
          </div>
          <svg className="ml-auto text-[#D1CFC9]" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
