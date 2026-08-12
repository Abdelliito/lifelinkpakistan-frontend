import { Card } from './Card'

export function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#9B9794] mb-2">{label}</p>
      <p className={`text-3xl font-bold font-display ${accent ? 'text-[#C41230]' : 'text-[#1A1818]'}`}>{value}</p>
      {sub && <p className="text-xs text-[#9B9794] mt-1">{sub}</p>}
    </Card>
  )
}
