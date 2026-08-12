import Link from 'next/link'
import { Btn, Card } from '@/components/ui'

const steps = [
  { title: 'Create an account', body: 'Sign up as someone looking for blood, a donor, or both — it takes less than a minute.' },
  { title: 'Search or register', body: 'Search compatible donors by blood group and city, or register your own availability as a donor.' },
  { title: 'Create an emergency request', body: 'Describe the situation in plain language and let AI extract the key details, or fill the form manually.' },
  { title: 'Get matched instantly', body: 'View a list of compatible donors in the same city, filtered using verified blood-type compatibility rules.' },
  { title: 'Connect directly', body: 'Reach out to available donors through the platform to coordinate the donation.' },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-widest text-[#C41230] mb-3">Step by Step</p>
        <h1 className="text-4xl font-bold text-[#1A1818] font-display mb-4">How LifeLink Pakistan Works</h1>
        <p className="text-[#6B6866]">From registration to receiving blood — here&apos;s the full journey.</p>
      </div>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <Card key={s.title} className="p-6 flex gap-5 items-start">
            <div className="w-9 h-9 rounded-full bg-[#FFF1F2] text-[#C41230] font-bold flex items-center justify-center shrink-0 font-display">
              {i + 1}
            </div>
            <div>
              <h3 className="font-bold text-[#1A1818] mb-1 font-display">{s.title}</h3>
              <p className="text-sm text-[#6B6866] leading-relaxed">{s.body}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-14">
        <Link href="/signup">
          <Btn size="lg">Get Started</Btn>
        </Link>
      </div>
    </div>
  )
}
