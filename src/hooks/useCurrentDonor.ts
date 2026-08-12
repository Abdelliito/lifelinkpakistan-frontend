'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/AuthContext'
import { donorService } from '@/services/donor.service'
import type { Donor } from '@/types'

/**
 * Loads the donor profile (if any) belonging to the currently logged-in
 * user. Returns `donor: null` once loaded if the user hasn't registered
 * as a donor yet — callers should show the appropriate empty state.
 */
export function useCurrentDonor() {
  const { user } = useAuth()
  const [donor, setDonor] = useState<Donor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state when user logs out
      setDonor(null)
      setLoading(false)
      return
    }
    setLoading(true)
    donorService.getCurrentDonor(user.id).then((d) => {
      if (active) {
        setDonor(d)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [user])

  return { donor, setDonor, loading }
}
