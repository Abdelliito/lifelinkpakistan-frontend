'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader, Textarea, Btn, Card, Select, Input, Alert } from '@/components/ui'
import { BackLink } from '@/components/shared/BackLink'
import { BLOOD_GROUPS, CITIES, URGENCY_OPTIONS } from '@/constants'
import { bloodRequestSchema, type BloodRequestFormValues } from '@/lib/validations'
import { aiService } from '@/services/ai.service'
import { requestService } from '@/services/request.service'
import { useAuth } from '@/features/auth/AuthContext'
import type { AIParseStatus, BloodGroup, City, UrgencyLevel } from '@/types'

const EXAMPLE = 'My father urgently needs O+ blood at Mayo Hospital Lahore.'

export default function AIAssistantPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [status, setStatus] = useState<AIParseStatus>('idle')
  const [aiError, setAiError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BloodRequestFormValues>({ resolver: zodResolver(bloodRequestSchema) })

  const handleAnalyze = async () => {
    setAiError('')
    setStatus('processing')
    try {
      const result = await aiService.parseBloodRequest(text)
      const filledCount = [result.bloodGroup, result.hospital, result.city, result.urgency].filter(Boolean).length

      setValue('bloodGroup', result.bloodGroup)
      setValue('hospital', result.hospital)
      setValue('city', result.city)
      setValue('urgency', (result.urgency || 'Normal') as UrgencyLevel)

      setStatus(filledCount >= 3 ? 'success' : 'partial')
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI could not process this request.')
      setStatus('error')
    }
  }

  const onSubmit = async (values: BloodRequestFormValues) => {
    if (!user) return
    setSubmitError('')
    setSubmitting(true)
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
      setSubmitError(err instanceof Error ? err.message : 'Could not create the request.')
    } finally {
      setSubmitting(false)
    }
  }

  const showForm = status === 'success' || status === 'partial'

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <BackLink href="/requests/new" label="Back to manual entry" />
      <PageHeader title="AI Request Assistant" subtitle="Describe the emergency in your own words" />

      <Card className="p-6 mb-6">
        <Textarea
          label="Describe the situation"
          placeholder={EXAMPLE}
          rows={4}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (status !== 'idle' && status !== 'processing') setStatus('typing')
          }}
        />
        <button
          type="button"
          onClick={() => setText(EXAMPLE)}
          className="text-xs text-[#C41230] font-medium mt-2 hover:underline"
        >
          Use example
        </button>

        <Btn
          variant="primary"
          className="w-full mt-4"
          onClick={handleAnalyze}
          loading={status === 'processing'}
          disabled={!text.trim() || status === 'processing'}
        >
          {status === 'processing' ? 'LifeLink AI is understanding your request…' : 'Analyze with AI'}
        </Btn>

        {status === 'error' && (
          <div className="mt-4">
            <Alert type="error">{aiError}</Alert>
          </div>
        )}
      </Card>

      {showForm && (
        <>
          <div className="mb-4">
            <Alert type={status === 'success' ? 'success' : 'warning'}>
              {status === 'success'
                ? 'AI extracted the details below. Please review before submitting.'
                : 'AI could only partially understand the request. Please fill in the missing fields below.'}
            </Alert>
          </div>

          {submitError && (
            <div className="mb-4">
              <Alert type="error">{submitError}</Alert>
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

              <Btn type="submit" variant="emergency" className="w-full" loading={submitting}>
                {submitting ? 'Submitting…' : 'Review Complete — Submit Request'}
              </Btn>
              <p className="text-xs text-[#9B9794] text-center">
                AI never submits automatically. You&apos;re always in control of the final request.
              </p>
            </form>
          </Card>
        </>
      )}
    </div>
  )
}
