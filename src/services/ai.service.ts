import { BLOOD_GROUPS, CITIES, MOCK_DELAY } from '@/constants'
import { delay } from '@/lib/utils'
import type { AIExtractedRequest } from '@/types'

/**
 * SIMULATED AI REQUEST ASSISTANT
 * ---------------------------------------------------------------------------
 * This is NOT a real call to Google Gemini or any LLM. It performs
 * lightweight, deterministic keyword/regex parsing over the input text
 * to approximate what an AI extraction step would return, so the rest of
 * the app (loading states, editable review form, error handling) can be
 * built and demoed realistically.
 *
 * To integrate a real AI backend later, replace the body of `parseBloodRequest`
 * with an API call and keep the same return shape.
 */

const HOSPITAL_KEYWORDS = [
  'Mayo Hospital',
  'Aga Khan Hospital',
  'PIMS Hospital',
  'Nishtar Hospital',
  'Jinnah Hospital',
  'Shaukat Khanum',
  'Services Hospital',
  'Civil Hospital',
  'Liaquat National Hospital',
  'Combined Military Hospital',
  'CMH',
]

const URGENCY_KEYWORDS: { pattern: RegExp; urgency: string }[] = [
  { pattern: /\burgent(ly)?\b|\bcritical\b|\bemergency\b|\basap\b|\bimmediately\b/i, urgency: 'Critical' },
  { pattern: /\bsoon\b|\btoday\b|\bwithin hours\b/i, urgency: 'Urgent' },
]

function extractBloodGroup(text: string): string {
  const match = text.match(/\b(A|B|AB|O)\s?([+-])\b/i)
  if (!match) return ''
  const candidate = `${match[1].toUpperCase()}${match[2]}`
  return BLOOD_GROUPS.includes(candidate as (typeof BLOOD_GROUPS)[number]) ? candidate : ''
}

function extractCity(text: string): string {
  const found = CITIES.find((c) => new RegExp(`\\b${c}\\b`, 'i').test(text))
  return found ?? ''
}

function extractHospital(text: string): string {
  const found = HOSPITAL_KEYWORDS.find((h) => text.toLowerCase().includes(h.toLowerCase()))
  if (found) return found === 'CMH' ? 'Combined Military Hospital' : found
  // Fallback: look for "at <Words> Hospital"
  const match = text.match(/at\s+([A-Z][\w'&]*(?:\s+[A-Z][\w'&]*)*\s+Hospital)/)
  return match ? match[1] : ''
}

function extractUrgency(text: string): string {
  for (const { pattern, urgency } of URGENCY_KEYWORDS) {
    if (pattern.test(text)) return urgency
  }
  return 'Normal'
}

export const aiService = {
  /**
   * Parses free-text describing a blood emergency and returns the fields
   * the UI should pre-fill. Never submits anything on its own — the
   * result is always handed back to the user for review.
   */
  async parseBloodRequest(text: string): Promise<AIExtractedRequest> {
    await delay(MOCK_DELAY.long + 400)

    const trimmed = text.trim()
    if (!trimmed) {
      throw new Error('Please describe the emergency first.')
    }
    if (trimmed.length < 8) {
      throw new Error('Could not understand the request. Please add a few more details.')
    }

    const bloodGroup = extractBloodGroup(trimmed)
    const city = extractCity(trimmed)
    const hospital = extractHospital(trimmed)
    const urgency = extractUrgency(trimmed)

    if (!bloodGroup && !city && !hospital) {
      throw new Error(
        'AI could not extract any details from that description. Try including the blood group, hospital, and city.'
      )
    }

    return { bloodGroup, hospital, city, urgency }
  },
}
