'use client'

import { useCallback, useState } from 'react'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Wraps any async mock-service call with loading/error/data state so
 * components don't need to hand-roll the same three useState calls
 * everywhere. Works well with the mock service layer's simulated delays.
 */
export function useAsync<T>() {
  const [state, setState] = useState<UseAsyncState<T>>({ data: null, loading: false, error: null })

  const run = useCallback(async (fn: () => Promise<T>) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await fn()
      setState({ data, loading: false, error: null })
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setState({ data: null, loading: false, error: message })
      throw err
    }
  }, [])

  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), [])

  return { ...state, run, reset, setState }
}
