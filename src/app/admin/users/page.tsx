'use client'

import { useEffect, useState } from 'react'
import { PageHeader, Input, Select, StatusBadge, EmptyState } from '@/components/ui'
import { TableRowSkeleton } from '@/components/ui/Feedback'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { adminService } from '@/services/admin.service'
import { formatDate } from '@/lib/utils'
import type { User } from '@/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [toDelete, setToDelete] = useState<User | null>(null)

  const load = () => {
    setLoading(true)
    adminService.getUsers().then((data) => {
      setUsers(data)
      setLoading(false)
    })
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
  useEffect(load, [])

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = !roleFilter || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleDelete = async () => {
    if (!toDelete) return
    await adminService.deleteUser(toDelete.id)
    setUsers((prev) => prev.filter((u) => u.id !== toDelete.id))
    setToDelete(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <PageHeader title="Users" subtitle="Manage all registered users" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select
          placeholder="All roles"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[
            { value: 'USER', label: 'User' },
            { value: 'DONOR', label: 'Donor' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
          className="sm:max-w-[160px]"
        />
      </div>

      <div className="bg-white border border-[#E4E2DF] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F6F4] border-b border-[#E4E2DF]">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-[#9B9794]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden sm:table-cell">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 hidden md:table-cell">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E2DF]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState icon="👤" title="No users found" body="Try adjusting your search or role filter." />
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#F8F6F4] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1A1818]">{u.name}</td>
                  <td className="px-4 py-3 text-[#6B6866] hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3 text-[#6B6866]">{u.role}</td>
                  <td className="px-4 py-3 text-[#6B6866] hidden md:table-cell">{formatDate(u.joinDate)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setToDelete(u)}
                      className="text-xs font-semibold text-[#C41230] hover:underline"
                      disabled={u.role === 'ADMIN'}
                    >
                      {u.role === 'ADMIN' ? '—' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {toDelete && (
        <ConfirmModal
          icon="🗑️"
          title="Delete this user?"
          body={
            <>
              This will permanently remove <strong>{toDelete.name}</strong> from the platform. This action cannot be undone.
            </>
          }
          confirmLabel="Delete User"
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
