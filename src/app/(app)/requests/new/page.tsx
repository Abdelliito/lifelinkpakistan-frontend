'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader, Input, Select, Btn, Card, Alert } from '@/components/ui'
import { BackLink } from '@/components/shared/BackLink'
import { BLOOD_GROUPS, CITIES, URGENCY_OPTIONS } from '@/constants'
import { bloodRequestSchema, type BloodRequestFormValues } from '@/lib/validations'
import { useAuth } from '@/features/auth/AuthContext'
import { requestService } from '@/services/request.service'
import type { BloodGroup, City, UrgencyLevel } from '@/types'

export default function NewRequestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BloodRequestFormValues>({ resolver: zodResolver(bloodRequestSchema) })

  const onSubmit = async (values: BloodRequestFormValues) => {
    if (!user) return
    setError('')
    setLoading(true)
    try {
      const request = await requestService.createRequest({
        patientName: values.patientName,
        bloodGroup: values.bloodGroup as BloodGroup,
        hospital: values.hospital,
        city: values.city as City,
        urgency: values.urgency as UrgencyLevel,
        contactNumber: values.contactNumber,
        userId: user.id,
      })
      router.push(`/requests/${request.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <BackLink href="/requests" label="Back to requests" />
      <PageHeader title="Create Blood Request" subtitle="Fill in patient and hospital details" />

      <div className="mb-6">
        <Link href="/requests/ai-assistant" className="flex items-center gap-3 p-4 bg-[#1A1818] rounded-xl hover:bg-[#252323] transition-colors">
          <span className="text-lg">✨</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Prefer to describe it instead?</p>
            <p className="text-xs text-white/50">Let AI extract the details from a sentence</p>
          </div>
          <svg className="text-white/30" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Patient Name" placeholder="Full name of the patient" error={errors.patientName?.message} {...register('patientName')} />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="bloodGroup"
              render={({ field }) => (
                <Select label="Blood Group" placeholder="Select" options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))} error={errors.bloodGroup?.message} {...field} />
              )}
            />
            <Controller
              control={control}
              name="urgency"
              render={({ field }) => (
                <Select label="Urgency" placeholder="Select" options={URGENCY_OPTIONS} error={errors.urgency?.message} {...field} />
              )}
            />
          </div>
          <Input label="Hospital" placeholder="e.g. Mayo Hospital" error={errors.hospital?.message} {...register('hospital')} />
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Select label="City" placeholder="Select city" options={CITIES.map((c) => ({ value: c, label: c }))} error={errors.city?.message} {...field} />
            )}
          />
          <Input label="Contact Number" placeholder="+92-3XX-XXXXXXX" error={errors.contactNumber?.message} {...register('contactNumber')} />

          <Btn type="submit" variant="emergency" className="w-full" loading={loading}>
            {loading ? 'Submitting…' : 'Submit Request'}
          </Btn>
        </form>
      </Card>
    </div>
  )
}
