/**
 * Enhanced API client with retry logic, error handling, and request interceptors.
 */

interface RetryConfig {
    maxRetries: number
    initialDelayMs: number
    maxDelayMs: number
    backoffMultiplier: number
    retryableStatusCodes: number[]
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface ApiError extends Error {
    status?: number
    detail?: string
    requestId?: string
}

/**
 * Delay function for exponential backoff
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Get JWT token from localStorage
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('lifelink_token')
}

/**
 * Check if status code is retryable
 */
function isRetryableStatus(status: number, retryableCodes: number[]): boolean {
    return retryableCodes.includes(status)
}

/**
 * Enhanced fetch with retry logic
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
    retryConfig: Partial<RetryConfig> = {},
): Promise<T> {
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
    let lastError: ApiError | null = null

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            const response = await performFetch<T>(endpoint, options)
            return response
        } catch (error) {
            lastError = error as ApiError

            // Check if error is retryable
            const isRetryable =
                lastError.status !== undefined &&
                isRetryableStatus(lastError.status, config.retryableStatusCodes) &&
                attempt < config.maxRetries

            if (!isRetryable) {
                throw error
            }

            // Calculate backoff delay
            const delayMs = Math.min(
                config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt),
                config.maxDelayMs,
            )

            console.warn(
                `API request failed (attempt ${attempt + 1}/${config.maxRetries + 1}), retrying in ${delayMs}ms...`,
                lastError,
            )

            await delay(delayMs)
        }
    }

    throw lastError
}

/**
 * Perform actual fetch with error handling
 */
async function performFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    const contentType = response.headers.get('content-type')
    const requestId = response.headers.get('x-request-id') || 'unknown'

    if (!response.ok) {
        const error: ApiError = new Error()
        error.status = response.status
        error.requestId = requestId

        try {
            const errorData = await response.json()
            error.message = errorData?.message || `HTTP error ${response.status}`
            error.detail = errorData?.detail
        } catch {
            error.message = `HTTP error ${response.status}`
        }

        throw error
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T
    }

    // Parse response based on content type
    if (contentType?.includes('application/json')) {
        return response.json()
    }

    return (await response.text()) as unknown as T
}

/**
 * API client with common HTTP methods
 */
export const apiClient = {
    get: <T,>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: 'GET' }),

    post: <T,>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T,>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    patch: <T,>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T,>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
}

/**
 * Create a request interceptor for custom headers or auth logic
 */
export function createRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit,
): void {
    // This is a placeholder for future request interceptor implementation
    // In a real application, you might wrap the fetch call or use a library like axios
    console.debug('Request interceptor registered')
}

/**
 * Create a response interceptor for common response handling
 */
export function createResponseInterceptor<T>(
    interceptor: (response: T) => T,
): void {
    // This is a placeholder for future response interceptor implementation
    console.debug('Response interceptor registered')
}
