import type { User } from '@/types'

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@lifelink.pk', phone: '+92-300-0000001', role: 'ADMIN', joinDate: '2023-01-01', status: 'Active', isDonor: false },
  { id: 'u2', name: 'Ahmed Raza', email: 'ahmed@example.com', phone: '+92-300-1234567', role: 'DONOR', joinDate: '2024-01-15', status: 'Active', isDonor: true },
  { id: 'u3', name: 'Sara Khan', email: 'sara@example.com', phone: '+92-321-7654321', role: 'DONOR', joinDate: '2024-02-20', status: 'Active', isDonor: true },
  { id: 'u4', name: 'Bilal Hussain', email: 'bilal@example.com', phone: '+92-333-9876543', role: 'USER', joinDate: '2023-11-05', status: 'Active', isDonor: false },
  { id: 'u5', name: 'Fatima Malik', email: 'fatima@example.com', phone: '+92-311-2233445', role: 'DONOR', joinDate: '2024-03-10', status: 'Suspended', isDonor: true },
  { id: 'u6', name: 'Usman Ali', email: 'usman@example.com', phone: '+92-345-1122334', role: 'DONOR', joinDate: '2023-09-22', status: 'Active', isDonor: true },
  { id: 'u7', name: 'Zainab Sheikh', email: 'zainab@example.com', phone: '+92-312-9988776', role: 'DONOR', joinDate: '2024-04-01', status: 'Active', isDonor: true },

  // Demo login accounts (frontend-only mock credentials)
  { id: 'u-demo-user', name: 'Demo User', email: 'user@lifelink.pk', phone: '+92-300-0000000', role: 'USER', joinDate: '2024-01-01', status: 'Active', isDonor: false },
]
