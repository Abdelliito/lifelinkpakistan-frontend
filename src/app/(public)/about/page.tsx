import { Card, StatCard } from '@/components/ui'
import { platformStats } from '@/data/dashboard'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-[#C41230] mb-3">About Us</p>
      <h1 className="text-4xl font-bold text-[#1A1818] font-display mb-6">Our Mission</h1>
      <p className="text-[#6B6866] leading-relaxed mb-4">
        Patients in Pakistan often struggle to find blood donors during emergencies, relying on personal contacts and
        social media that can cost precious time. LifeLink Pakistan centralizes donor discovery so families can find
        compatible, willing donors quickly — reducing response time when it matters most.
      </p>
      <p className="text-[#6B6866] leading-relaxed mb-10">
        We built LifeLink as a free, centralized network connecting blood donors with patients and their families
        across the country, combined with AI-assisted request creation to make emergency reporting faster and
        simpler.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <StatCard label="Registered Donors" value={platformStats.totalDonors.toLocaleString()} />
        <StatCard label="Cities Covered" value={platformStats.citiesCovered.toString()} />
      </div>

      <Card className="p-6">
        <h2 className="font-bold text-[#1A1818] mb-2 font-display">A note on this build</h2>
        <p className="text-sm text-[#6B6866] leading-relaxed">
          This is a frontend-only MVP: all authentication, donor data, and blood requests are simulated with mock
          services for demonstration purposes. No real backend, database, or AI provider is connected.
        </p>
      </Card>
    </div>
  )
}
