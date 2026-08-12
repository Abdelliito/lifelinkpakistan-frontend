// ── Enums / Unions ───────────────────────────────────────────────────────────

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type City =
  | 'Karachi'
  | 'Lahore'
  | 'Islamabad'
  | 'Rawalpindi'
  | 'Faisalabad'
  | 'Multan'
  | 'Peshawar'
  | 'Quetta'
  | 'Sialkot'
  | 'Hyderabad'

export type UrgencyLevel = 'Critical' | 'Urgent' | 'Normal'

export type RequestStatus = 'Open' | 'Matching Donors Found' | 'Completed' | 'Closed'

export type DonorAvailability = 'Available' | 'Unavailable'

export type UserRole = 'USER' | 'DONOR' | 'ADMIN'

export type UserStatus = 'Active' | 'Suspended'

// ── Core Entities ────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  joinDate: string
  status: UserStatus
  isDonor: boolean
}

export interface Donor {
  id: string
  userId: string
  name: string
  initials: string
  bloodGroup: BloodGroup
  city: City
  availability: DonorAvailability
  lastDonation: string
  lastDonationDate?: string
  phone: string
  joinedDate: string
}

export interface BloodRequest {
  id: string
  patientName: string
  bloodGroup: BloodGroup
  hospital: string
  city: City
  urgency: UrgencyLevel
  status: RequestStatus
  contactNumber: string
  createdAt: string
  userId: string
}

export interface MatchingDonor {
  id: string
  name: string
  initials: string
  bloodGroup: BloodGroup
  city: City
  availability: DonorAvailability
}

// ── AI Assistant ─────────────────────────────────────────────────────────────

export interface AIExtractedRequest {
  bloodGroup: string
  hospital: string
  city: string
  urgency: string
}

export type AIParseStatus = 'idle' | 'typing' | 'processing' | 'success' | 'partial' | 'error'

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthSession {
  user: User
  token: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  intent: 'find' | 'donate' | 'both'
}

export interface LoginPayload {
  email: string
  password: string
}
