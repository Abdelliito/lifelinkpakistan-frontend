'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader, Select, Input, Btn, Toggle, Card, Alert, Skeleton, EmptyState } from '@/components/ui'
import { BLOOD_GROUPS, CITIES } from '@/constants'
import { donorProfileSchema, type DonorProfileFormValues } from '@/lib/validations'
import { useCurrentDonor } from '@/hooks/useCurrentDonor'
import { donorService } from '@/services/donor.service'
import type { BloodGroup, City } from '@/types'

export default function DonorProfilePage() {
  const router = useRouter()
  const { donor, setDonor, loading: donorLoading } = useCurrentDonor()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorProfileFormValues>({
    resolver: zodResolver(donorProfileSchema),
    values: donor
      ? {
          bloodGroup: donor.bloodGroup,
          city: donor.city,
          phone: donor.phone,
          available: donor.availability === 'Available',
          lastDonation: donor.lastDonationDate ?? '',
        }
      : undefined,
  })

  const onSubmit = async (values: DonorProfileFormValues) => {
    if (!donor) return
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      const updated = await donorService.updateDonor(donor.id, {
        bloodGroup: values.bloodGroup as BloodGroup,
        city: values.city as City,
        phone: values.phone,
        availability: values.available ? 'Available' : 'Unavailable',
        lastDonationDate: values.lastDonation || undefined,
      })
      setDonor(updated)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAvailability = async (available: boolean) => {
    if (!donor) return
    const updated = await donorService.updateAvailability(donor.id, available ? 'Available' : 'Unavailable')
    setDonor(updated)
  }

  if (donorLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-52 mb-6" />
        <Card className="p-8 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    )
  }

  if (!donor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <EmptyState
          icon="🩸"
          title="No donor profile yet"
          body="You haven't registered as a donor. Register now to help patients find you."
          action={<Btn onClick={() => router.push('/donor')}>Become a Donor</Btn>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <PageHeader title="Donor Profile" subtitle="Manage your donor details and availability" />

      {success && (
        <div className="mb-4">
          <Alert type="success">Your donor profile has been updated.</Alert>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      <Card className="p-6 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#1A1818]">Quick Availability Toggle</p>
          <p className="text-xs text-[#9B9794]">Switch instantly without saving the full form</p>
        </div>
        <Toggle checked={donor.availability === 'Available'} onChange={handleToggleAvailability} />
      </Card>

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            control={control}
            name="bloodGroup"
            render={({ field }) => (
              <Select label="Blood Group" options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))} error={errors.bloodGroup?.message} {...field} />
            )}
          />
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Select label="City" options={CITIES.map((c) => ({ value: c, label: c }))} error={errors.city?.message} {...field} />
            )}
          />
          <Input label="Phone Number" error={errors.phone?.message} {...register('phone')} />
          <Input label="Last Donation Date" type="date" error={errors.lastDonation?.message} {...register('lastDonation')} />

          <Controller
            control={control}
            name="available"
            render={({ field }) => (
              <div className="flex items-center justify-between p-4 bg-[#F8F6F4] rounded-lg">
                <p className="text-sm font-medium text-[#1A1818]">Available to donate</p>
                <Toggle checked={field.value} onChange={field.onChange} />
              </div>
            )}
          />

          <Btn type="submit" variant="primary" className="w-full" loading={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Btn>
        </form>
      </Card>
    </div>
  )
}
