export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-[#E4E2DF]" />
  return (
    <div className="flex items-center gap-3">
      <hr className="flex-1 border-[#E4E2DF]" />
      <span className="text-xs text-[#9B9794] font-medium">{label}</span>
      <hr className="flex-1 border-[#E4E2DF]" />
    </div>
  )
}
