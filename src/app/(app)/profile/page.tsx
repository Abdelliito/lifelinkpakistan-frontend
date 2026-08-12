'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader, Input, Btn, Card, Alert, Divider } from '@/components/ui'
import { profileSettingsSchema, type ProfileSettingsFormValues } from '@/lib/validations'
import { useAuth } from '@/features/auth/AuthContext'

export default function ProfileSettingsPage() {
  const { user, updateUser } = useAuth()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    values: user ? { name: user.name, email: user.email, phone: user.phone ?? '', currentPassword: '', newPassword: '' } : undefined,
  })

  const onSubmit = async (values: ProfileSettingsFormValues) => {
    setSuccess(false)
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    updateUser({ name: values.name, email: values.email, phone: values.phone })
    setSaving(false)
    setSuccess(true)
  }

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <PageHeader title="Profile Settings" subtitle="Manage your account information" />

      {success && (
        <div className="mb-4">
          <Alert type="success">Your profile has been updated.</Alert>
        </div>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Phone Number" error={errors.phone?.message} {...register('phone')} />

          <Divider label="Change Password" />

          <Input label="Current Password" type="password" placeholder="Leave blank to keep current" {...register('currentPassword')} />
          <Input label="New Password" type="password" placeholder="Leave blank to keep current" {...register('newPassword')} />

          <Btn type="submit" variant="primary" className="w-full" loading={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Btn>
        </form>
      </Card>

      <Card className="p-6 mt-6 border-[#FECDD3]">
        <p className="text-sm font-semibold text-[#1A1818] mb-1">Account Role</p>
        <p className="text-xs text-[#9B9794]">
          You are currently registered as <strong className="text-[#1A1818]">{user.role}</strong>.
        </p>
      </Card>
    </div>
  )
}
