'use client'

import { useRouter } from 'next/navigation'
import { Btn, Card } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthContext'

const points = [
  { icon: '📝', title: 'Describe or fill a form', body: 'Type a plain-language description for AI to parse, or fill a short structured form yourself.' },
  { icon: '🔎', title: 'Instant donor matching', body: 'We match your request against compatible blood groups and city using verified rules.' },
  { icon: '📞', title: 'Direct contact', body: 'Reach out to available donors right away — no waiting on hold or hospital red tape.' },
]

export default function EmergencyRequestLandingPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  const start = () => {
    router.push(isLoggedIn ? '/requests/new' : '/signup')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF1F2] border border-[#FECDD3] rounded-full text-xs font-semibold text-[#C41230] mb-6">
        🚨 Emergency Blood Request
      </div>
      <h1 className="text-4xl font-bold text-[#1A1818] font-display mb-4">Need blood right now?</h1>
      <p className="text-[#6B6866] mb-10 max-w-xl mx-auto leading-relaxed">
        Create an emergency request and we&apos;ll instantly show you compatible donors in your city. It takes less
        than a minute.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
        {points.map((p) => (
          <Card key={p.title} className="p-5">
            <div className="text-2xl mb-3">{p.icon}</div>
            <h3 className="font-bold text-[#1A1818] mb-1 text-sm font-display">{p.title}</h3>
            <p className="text-xs text-[#6B6866] leading-relaxed">{p.body}</p>
          </Card>
        ))}
      </div>

      <Btn variant="emergency" size="lg" onClick={start}>
        {isLoggedIn ? 'Create Emergency Request' : 'Sign Up to Get Started'}
      </Btn>
      {!isLoggedIn && <p className="text-xs text-[#9B9794] mt-3">Already have an account? Log in to continue.</p>}
    </div>
  )
}
