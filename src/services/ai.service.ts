import { apiFetch } from '@/lib/api'
import type { AIExtractedRequest } from '@/types'

export const aiService = {
  /**
   * Parses free-text describing a blood emergency and returns extracted fields
   * via backend Google Gemini AI endpoint.
   */
  async parseBloodRequest(text: string): Promise<AIExtractedRequest> {
    return await apiFetch<AIExtractedRequest>('/ai/parse-request', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
  },
}

