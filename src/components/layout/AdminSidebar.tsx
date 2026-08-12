'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/AuthContext'

const items = [
  {
    href: '/admin',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/donors',
    label: 'Donors',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 2C12 2 6 7.5 6 12a6 6 0 0012 0C18 7.5 12 2 12 2Z" />
      </svg>
    ),
  },
  {
    href: '/admin/requests',
    label: 'Blood Requests',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <aside className="w-56 bg-white border-r border-[#E4E2DF] min-h-screen flex flex-col shrink-0">
      <div className="p-5 border-b border-[#E4E2DF]">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-[#C41230] rounded-md flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2C8 2 3 6.5 3 10a5 5 0 0010 0C13 6.5 8 2 8 2Z" fill="white" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-[#1A1818] font-display">LifeLink</p>
            <p className="text-[10px] font-semibold text-[#C41230] uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {items.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              pathname === href ? 'bg-[#FFF1F2] text-[#C41230]' : 'text-[#6B6866] hover:bg-[#F5F3F0] hover:text-[#1A1818]'
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-[#E4E2DF]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#6B6866] hover:bg-[#F5F3F0] hover:text-[#1A1818] rounded-lg transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  )
}
