import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Simulates network latency for the mock service layer. */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function initialsFromName(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(iso).toLocaleDateString('en-PK', opts)
}

export function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}
