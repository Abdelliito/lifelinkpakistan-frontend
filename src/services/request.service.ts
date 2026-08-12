import { mockRequests } from '@/data/bloodRequests'
import { mockDonors } from '@/data/donors'
import { MOCK_DELAY } from '@/constants'
import { delay, genId } from '@/lib/utils'
import { getCompatibleDonorGroups } from '@/lib/bloodCompatibility'
import type { BloodRequest, MatchingDonor, RequestStatus } from '@/types'

/**
 * FRONTEND-ONLY MOCK BLOOD REQUEST SERVICE
 */

let requests: BloodRequest[] = [...mockRequests]

export const requestService = {
  async getRequests(userId?: string): Promise<BloodRequest[]> {
    await delay(MOCK_DELAY.short)
    return userId ? requests.filter((r) => r.userId === userId) : requests
  },

  async getRequestById(id: string): Promise<BloodRequest | null> {
    await delay(MOCK_DELAY.short)
    return requests.find((r) => r.id === id) ?? null
  },

  async createRequest(input: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): Promise<BloodRequest> {
    await delay(MOCK_DELAY.long)
    const request: BloodRequest = {
      ...input,
      id: genId('r'),
      status: 'Open',
      createdAt: new Date().toISOString(),
    }
    requests = [request, ...requests]
    return request
  },

  async updateRequest(id: string, patch: Partial<BloodRequest>): Promise<BloodRequest> {
    await delay(MOCK_DELAY.medium)
    requests = requests.map((r) => (r.id === id ? { ...r, ...patch } : r))
    const updated = requests.find((r) => r.id === id)
    if (!updated) throw new Error('Request not found.')
    return updated
  },

  async updateRequestStatus(id: string, status: RequestStatus): Promise<BloodRequest> {
    return requestService.updateRequest(id, { status })
  },

  async getMatchingDonors(request: BloodRequest): Promise<MatchingDonor[]> {
    await delay(MOCK_DELAY.medium)
    const compatibleGroups = getCompatibleDonorGroups(request.bloodGroup)
    return mockDonors
      .filter((d) => compatibleGroups.includes(d.bloodGroup) && d.city === request.city)
      .map((d) => ({
        id: d.id,
        name: d.name,
        initials: d.initials,
        bloodGroup: d.bloodGroup,
        city: d.city,
        availability: d.availability,
      }))
  },
}
