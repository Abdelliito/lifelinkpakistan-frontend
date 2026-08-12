import { z } from 'zod'
import { BLOOD_GROUPS, CITIES } from '@/constants'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Full name is required.'),
    email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    intent: z.enum(['find', 'donate', 'both']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
export type SignupFormValues = z.infer<typeof signupSchema>

export const donorProfileSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS as [string, ...string[]], { message: 'Please select your blood group.' }),
  city: z.enum(CITIES as [string, ...string[]], { message: 'Please select your city.' }),
  phone: z.string().trim().min(7, 'Enter a valid phone number.'),
  available: z.boolean(),
  lastDonation: z.string().optional(),
})
export type DonorProfileFormValues = z.infer<typeof donorProfileSchema>

export const bloodRequestSchema = z.object({
  patientName: z.string().trim().min(2, 'Patient name is required.'),
  bloodGroup: z.enum(BLOOD_GROUPS as [string, ...string[]], { message: 'Blood group is required.' }),
  hospital: z.string().trim().min(2, 'Hospital name is required.'),
  city: z.enum(CITIES as [string, ...string[]], { message: 'City is required.' }),
  urgency: z.enum(['Critical', 'Urgent', 'Normal'], { message: 'Urgency level is required.' }),
  contactNumber: z.string().trim().min(7, 'Contact number is required.'),
})
export type BloodRequestFormValues = z.infer<typeof bloodRequestSchema>

export const profileSettingsSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required.'),
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  phone: z.string().trim().min(7, 'Enter a valid phone number.'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
})
export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>
