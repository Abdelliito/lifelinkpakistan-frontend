import { Navbar } from '@/components/layout/Navbar'
import { RequireAuth } from '@/features/auth/RouteGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F8F6F4] flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </RequireAuth>
  )
}
