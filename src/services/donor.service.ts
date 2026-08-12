import { mockDonors } from '@/data/donors'
import { MOCK_DELAY } from '@/constants'
import { delay, genId, initialsFromName } from '@/lib/utils'
import type { City, BloodGroup, Donor, DonorAvailability } from '@/types'

/**
 * FRONTEND-ONLY MOCK DONOR SERVICE
 * All operations mutate an in-memory copy of the mock data and resolve
 * asynchronously to simulate real network calls. Replace the internals
 * with real API/database calls when a backend is introduced.
 */

let donors: Donor[] = [...mockDonors]

export interface DonorSearchFilters {
  bloodGroup?: BloodGroup | ''
  city?: City | ''
  availability?: DonorAvailability | ''
}

export const donorService = {
  async getDonors(): Promise<Donor[]> {
    await delay(MOCK_DELAY.short)
    return donors
  },

  async searchDonors(filters: DonorSearchFilters): Promise<Donor[]> {
    await delay(MOCK_DELAY.medium)
    let results = donors
    if (filters.bloodGroup) results = results.filter((d) => d.bloodGroup === filters.bloodGroup)
    if (filters.city) results = results.filter((d) => d.city === filters.city)
    if (filters.availability) results = results.filter((d) => d.availability === filters.availability)
    return [...results].sort((a) => (a.availability === 'Available' ? -1 : 1))
  },

  async getDonorById(id: string): Promise<Donor | null> {
    await delay(MOCK_DELAY.short)
    return donors.find((d) => d.id === id) ?? null
  },

  async getCurrentDonor(userId: string): Promise<Donor | null> {
    await delay(MOCK_DELAY.short)
    return donors.find((d) => d.userId === userId) ?? null
  },

  async createDonor(input: Omit<Donor, 'id' | 'initials' | 'joinedDate'>): Promise<Donor> {
    await delay(MOCK_DELAY.long)
    const donor: Donor = {
      ...input,
      id: genId('d'),
      initials: initialsFromName(input.name),
      joinedDate: new Date().toISOString().slice(0, 10),
    }
    donors = [donor, ...donors]
    return donor
  },

  async updateDonor(id: string, patch: Partial<Donor>): Promise<Donor> {
    await delay(MOCK_DELAY.medium)
    donors = donors.map((d) => (d.id === id ? { ...d, ...patch } : d))
    const updated = donors.find((d) => d.id === id)
    if (!updated) throw new Error('Donor not found.')
    return updated
  },

  async updateAvailability(id: string, availability: DonorAvailability): Promise<Donor> {
    return donorService.updateDonor(id, { availability })
  },

  async deleteDonor(id: string): Promise<void> {
    await delay(MOCK_DELAY.medium)
    donors = donors.filter((d) => d.id !== id)
  },
}
