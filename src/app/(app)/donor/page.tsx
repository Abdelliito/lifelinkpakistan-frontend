'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader, Select, Input, Btn, Toggle, Card, Alert, Skeleton } from '@/components/ui'
import { BLOOD_GROUPS, CITIES } from '@/constants'
import { donorProfileSchema, type DonorProfileFormValues } from '@/lib/validations'
import { useAuth } from '@/features/auth/AuthContext'
import { useCurrentDonor } from '@/hooks/useCurrentDonor'
import { donorService } from '@/services/donor.service'
import type { BloodGroup, City } from '@/types'

export default function BecomeDonorPage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const { donor, loading: donorLoading } = useCurrentDonor()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorProfileFormValues>({
    resolver: zodResolver(donorProfileSchema),
    defaultValues: { available: true },
  })

  // Already a donor -> send to profile management instead
  useEffect(() => {
    if (!donorLoading && donor) {
      router.replace('/donor/profile')
    }
  }, [donorLoading, donor, router])

  const onSubmit = async (values: DonorProfileFormValues) => {
    if (!user) return
    setError('')
    setLoading(true)
    try {
      await donorService.createDonor({
        userId: user.id,
        name: user.name,
        bloodGroup: values.bloodGroup as BloodGroup,
        city: values.city as City,
        availability: values.available ? 'Available' : 'Unavailable',
        lastDonation: values.lastDonation ? 'Recently' : 'Never donated',
        lastDonationDate: values.lastDonation || undefined,
        phone: values.phone,
      })
      updateUser({ isDonor: true, role: 'DONOR' })
      router.push('/donor/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not register as a donor.')
    } finally {
      setLoading(false)
    }
  }

  if (donorLoading || donor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-52 mb-6" />
        <Card className="p-8 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <PageHeader title="Become a Donor" subtitle="Register your details so patients can find and contact you" />

      {error && (
        <div className="mb-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            control={control}
            name="bloodGroup"
            render={({ field }) => (
              <Select
                label="Blood Group"
                placeholder="Select your blood group"
                options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
                error={errors.bloodGroup?.message}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Select
                label="City"
                placeholder="Select your city"
                options={CITIES.map((c) => ({ value: c, label: c }))}
                error={errors.city?.message}
                {...field}
              />
            )}
          />
          <Input label="Phone Number" placeholder="+92-3XX-XXXXXXX" error={errors.phone?.message} {...register('phone')} />
          <Input label="Last Donation Date (optional)" type="date" error={errors.lastDonation?.message} {...register('lastDonation')} />

          <Controller
            control={control}
            name="available"
            render={({ field }) => (
              <div className="flex items-center justify-between p-4 bg-[#F8F6F4] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-[#1A1818]">Available to donate</p>
                  <p className="text-xs text-[#9B9794]">You can toggle this anytime from your profile</p>
                </div>
                <Toggle checked={field.value} onChange={field.onChange} />
              </div>
            )}
          />

          <Btn type="submit" variant="primary" className="w-full" loading={loading}>
            {loading ? 'Registering…' : 'Register as Donor'}
          </Btn>
        </form>
      </Card>
    </div>
  )
}
