'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    reset = () => {
        this.setState({ hasError: false, error: undefined })
    }

    render() {
        if (this.state.hasError && this.state.error) {
            return (
                this.props.fallback?.(this.state.error, this.reset) || (
                    <div className="p-6 max-w-md mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-lg">
                            <h2 className="text-lg font-semibold text-red-900">Something went wrong</h2>
                            <p className="text-red-700 mt-2">{this.state.error.message}</p>
                            <button
                                onClick={this.reset}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )
            )
        }

        return this.props.children
    }
}

/**
 * Hook-based error boundary (compatible with functional components)
 * Usage: Wrap components in <ErrorBoundary><Component /></ErrorBoundary>
 */
export function useErrorHandler() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            console.error('Unhandled error:', event.error)
        }

        const handleRejection = (event: PromiseRejectionEvent) => {
            console.error('Unhandled promise rejection:', event.reason)
        }

        window.addEventListener('error', handleError)
        window.addEventListener('unhandledrejection', handleRejection)

        return () => {
            window.removeEventListener('error', handleError)
            window.removeEventListener('unhandledrejection', handleRejection)
        }
    }, [])
}
