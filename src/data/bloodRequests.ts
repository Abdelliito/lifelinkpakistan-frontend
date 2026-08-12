import type { BloodRequest } from '@/types'

export const mockRequests: BloodRequest[] = [
  { id: 'r1', patientName: 'Mohammad Farooq', bloodGroup: 'O+', hospital: 'Mayo Hospital', city: 'Lahore', urgency: 'Critical', status: 'Open', contactNumber: '+92-300-1234567', createdAt: '2026-08-10T08:30:00Z', userId: 'u2' },
  { id: 'r2', patientName: 'Nadia Siddiqui', bloodGroup: 'A+', hospital: 'Aga Khan Hospital', city: 'Karachi', urgency: 'Urgent', status: 'Matching Donors Found', contactNumber: '+92-321-7654321', createdAt: '2026-08-09T14:15:00Z', userId: 'u2' },
  { id: 'r3', patientName: 'Tariq Mehmood', bloodGroup: 'B+', hospital: 'PIMS Hospital', city: 'Islamabad', urgency: 'Normal', status: 'Completed', contactNumber: '+92-333-9876543', createdAt: '2026-08-07T10:00:00Z', userId: 'u3' },
  { id: 'r4', patientName: 'Rukhsana Bibi', bloodGroup: 'AB-', hospital: 'Nishtar Hospital', city: 'Multan', urgency: 'Critical', status: 'Open', contactNumber: '+92-345-1122334', createdAt: '2026-08-10T06:45:00Z', userId: 'u4' },
  { id: 'r5', patientName: 'Kamran Yousuf', bloodGroup: 'O-', hospital: 'Jinnah Hospital', city: 'Lahore', urgency: 'Urgent', status: 'Closed', contactNumber: '+92-301-5566778', createdAt: '2026-07-28T09:20:00Z', userId: 'u2' },
]
