'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Btn, Card, Select, StatCard } from '@/components/ui'
import { BLOOD_GROUPS, CITIES } from '@/constants'
import { platformStats } from '@/data/dashboard'

export default function LandingPage() {
  const router = useRouter()
  const [bloodGroup, setBloodGroup] = useState('')
  const [city, setCity] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (bloodGroup) params.set('bloodGroup', bloodGroup)
    if (city) params.set('city', city)
    router.push(`/find-donors${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="bg-[#F8F6F4]">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF1F2] border border-[#FECDD3] rounded-full text-xs font-semibold text-[#C41230] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41230]" />
              Pakistan&apos;s Emergency Blood Network
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1A1818] leading-[1.1] mb-5 font-display">
              Find Blood.
              <br />
              <span className="text-[#C41230]">Save a Life.</span>
            </h1>
            <p className="text-lg text-[#6B6866] leading-relaxed mb-8 max-w-lg">
              A trusted platform connecting patients and families with available blood donors across Pakistan — fast, safe, and free.
            </p>
            <div className="flex flex-wrap gap-3">
              <Btn variant="primary" size="lg" onClick={() => router.push('/find-donors')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Find a Donor
              </Btn>
              <Btn variant="outline" size="lg" onClick={() => router.push('/donor')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2C12 2 6 7.5 6 12a6 6 0 0012 0C18 7.5 12 2 12 2Z" />
                </svg>
                Become a Donor
              </Btn>
            </div>
            <button
              onClick={() => router.push('/emergency-request')}
              className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#C41230] text-[#C41230] font-bold text-sm rounded-lg hover:bg-[#FFF1F2] transition-colors"
            >
              🚨 Create Emergency Request
            </button>
          </div>

          {/* Quick Search Card */}
          <div className="animate-fade-in">
            <Card className="p-6 shadow-xl shadow-black/5">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 bg-[#FFF1F2] rounded-lg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C41230" strokeWidth={2.5}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
                <div>
                  <h2 className="font-bold text-[#1A1818] text-base font-display">Find a Donor Now</h2>
                  <p className="text-xs text-[#9B9794]">Search by blood type and city</p>
                </div>
              </div>
              <div className="space-y-3">
                <Select
                  label="Blood Group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder="Select blood group"
                  options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
                />
                <Select
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Select city"
                  options={CITIES.map((c) => ({ value: c, label: c }))}
                />
                <Btn variant="primary" className="w-full" onClick={handleSearch}>
                  Search Donors
                </Btn>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E4E2DF] flex items-center justify-center gap-2 text-xs text-[#9B9794]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                {platformStats.availableDonors.toLocaleString()} donors available right now
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-[#E4E2DF]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Registered Donors" value={platformStats.totalDonors.toLocaleString()} sub="Across Pakistan" />
            <StatCard label="Available Donors" value={platformStats.availableDonors.toLocaleString()} sub="Ready to help" accent />
            <StatCard label="Requests Helped" value={platformStats.requestsHelped.toLocaleString()} sub="Lives connected" />
            <StatCard label="Cities Covered" value={platformStats.citiesCovered.toString()} sub="And growing" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C41230] mb-3">Simple &amp; Fast</p>
          <h2 className="text-4xl font-bold text-[#1A1818] font-display">How LifeLink Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Search or Request',
              body: 'Find donors by blood group and city, or create an emergency blood request in seconds.',
              icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              ),
            },
            {
              step: '02',
              title: 'Get Matched',
              body: 'View compatible donors based on blood group and location. AI helps extract details from your description.',
              icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M12 2C12 2 6 7.5 6 12a6 6 0 0012 0C18 7.5 12 2 12 2Z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              ),
            },
            {
              step: '03',
              title: 'Connect and Help',
              body: 'Contact available donors directly and coordinate the donation. Every second matters.',
              icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              ),
            },
          ].map(({ step, title, body, icon }) => (
            <div key={step} className="relative">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] flex items-center justify-center text-[#C41230]">{icon}</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#D1CFC9] mb-1 font-display">{step}</p>
                  <h3 className="text-lg font-bold text-[#1A1818] mb-2 font-display">{title}</h3>
                  <p className="text-sm text-[#6B6866] leading-relaxed">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Feature */}
      <section className="bg-[#1A1818]">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#C41230] mb-3">AI-Powered</p>
              <h2 className="text-4xl font-bold text-white mb-4 font-display">
                Describe the Emergency.
                <br />
                Let AI Handle the Details.
              </h2>
              <p className="text-[#9B9794] mb-8 leading-relaxed">
                In a crisis, typing precise forms is hard. Just describe the situation in your own words — our AI extracts the key details instantly.
              </p>
              <Btn variant="primary" size="lg" onClick={() => router.push('/requests/ai-assistant')}>
                Try AI Request Assistant
              </Btn>
            </div>
            <div>
              <Card className="p-5 bg-[#252323] border-[#333]">
                <p className="text-xs font-semibold text-[#9B9794] mb-3">Your message</p>
                <div className="bg-[#1A1818] rounded-lg px-4 py-3 text-sm text-white/80 mb-4 border border-[#333] italic">
                  &quot;My father urgently needs O+ blood at Mayo Hospital Lahore.&quot;
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-[#333]" />
                  <span className="text-[10px] font-bold text-[#C41230] uppercase tracking-wider">AI Extracted</span>
                  <div className="h-px flex-1 bg-[#333]" />
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Blood Group', value: 'O+' },
                    { label: 'Hospital', value: 'Mayo Hospital' },
                    { label: 'City', value: 'Lahore' },
                    { label: 'Urgency', value: 'Urgent' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-[#333] last:border-0">
                      <span className="text-xs text-[#9B9794]">{label}</span>
                      <span className="text-sm font-semibold text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#333]">
                  <p className="text-xs text-[#6B6866] text-center">AI extracted these details. Please review before continuing.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Donor CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-[#C41230] rounded-2xl p-10 lg:p-14 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 font-display">Your Blood Can Save a Life.</h2>
          <p className="text-white/80 mb-8 text-lg max-w-lg mx-auto">
            Join thousands of registered donors in Pakistan. One donation can save up to 3 lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Btn size="lg" className="bg-white text-[#C41230] hover:bg-white/90 font-bold" onClick={() => router.push('/signup')}>
              Become a Donor
            </Btn>
            <Btn
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10 hover:border-white"
              onClick={() => router.push('/how-it-works')}
            >
              Learn More
            </Btn>
          </div>
        </div>
      </section>
    </div>
  )
}
