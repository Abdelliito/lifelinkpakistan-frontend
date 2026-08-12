import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { RequireAdmin } from '@/features/auth/RouteGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdmin>
      <div className="min-h-screen bg-[#F8F6F4] flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </RequireAdmin>
  )
}
