import Link from 'next/link'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const boxSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'
  const iconSize = size === 'sm' ? 12 : 14
  return (
    <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
      <span className={`${boxSize} bg-[#C41230] rounded-lg flex items-center justify-center shrink-0`}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <path d="M8 2C8 2 3 6.5 3 10a5 5 0 0010 0C13 6.5 8 2 8 2Z" fill="white" />
        </svg>
      </span>
      <span className="font-bold text-[#1A1818] text-lg font-display">
        LifeLink <span className="text-[#C41230]">Pakistan</span>
      </span>
    </Link>
  )
}
