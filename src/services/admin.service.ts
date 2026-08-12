import { mockUsers } from '@/data/users'
import { mockDonors } from '@/data/donors'
import { mockRequests } from '@/data/bloodRequests'
import { MOCK_DELAY } from '@/constants'
import { delay } from '@/lib/utils'
import type { BloodRequest, Donor, RequestStatus, User } from '@/types'

/**
 * FRONTEND-ONLY MOCK ADMIN SERVICE
 * Operates on in-memory copies shared for the admin views. Mutations here
 * are session-only and reset on page reload, consistent with the rest of
 * the mock service layer.
 */

let users: User[] = [...mockUsers]
let donors: Donor[] = [...mockDonors]
let requests: BloodRequest[] = [...mockRequests]

export const adminService = {
  async getStats() {
    await delay(MOCK_DELAY.short)
    return {
      totalUsers: users.length,
      totalDonors: donors.length,
      availableDonors: donors.filter((d) => d.availability === 'Available').length,
      activeRequests: requests.filter((r) => r.status === 'Open').length,
    }
  },

  async getUsers(): Promise<User[]> {
    await delay(MOCK_DELAY.medium)
    return users
  },

  async deleteUser(id: string): Promise<void> {
    await delay(MOCK_DELAY.medium)
    users = users.filter((u) => u.id !== id)
  },

  async getDonors(): Promise<Donor[]> {
    await delay(MOCK_DELAY.medium)
    return donors
  },

  async deleteDonor(id: string): Promise<void> {
    await delay(MOCK_DELAY.medium)
    donors = donors.filter((d) => d.id !== id)
  },

  async getRequests(): Promise<BloodRequest[]> {
    await delay(MOCK_DELAY.medium)
    return requests
  },

  async updateRequestStatus(id: string, status: RequestStatus): Promise<BloodRequest> {
    await delay(MOCK_DELAY.medium)
    requests = requests.map((r) => (r.id === id ? { ...r, status } : r))
    const updated = requests.find((r) => r.id === id)
    if (!updated) throw new Error('Request not found.')
    return updated
  },
}
