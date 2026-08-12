import type { BloodGroup, City } from '@/types'

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const CITIES: City[] = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Hyderabad',
]

export const URGENCY_OPTIONS = [
  { value: 'Critical', label: '🔴 Critical — Immediate need' },
  { value: 'Urgent', label: '🟡 Urgent — Within hours' },
  { value: 'Normal', label: '🟢 Normal — Within a day' },
]

export const REQUEST_STATUSES = ['Open', 'Matching Donors Found', 'Completed', 'Closed'] as const

export const APP_NAME = 'LifeLink Pakistan'
export const APP_TAGLINE = 'Connecting Blood Donors with Lives in Need'

// Simulated network delay range (ms) used by the mock service layer
export const MOCK_DELAY = {
  short: 500,
  medium: 900,
  long: 1400,
} as const

export const DEMO_ACCOUNTS = {
  user: { email: 'user@lifelink.pk', password: 'user123' },
  admin: { email: 'admin@lifelink.pk', password: 'admin123' },
} as const
