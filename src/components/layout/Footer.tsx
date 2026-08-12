export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E4E2DF]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-[#C41230] rounded-md flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C8 2 3 6.5 3 10a5 5 0 0010 0C13 6.5 8 2 8 2Z" fill="white" />
                </svg>
              </span>
              <span className="font-bold text-[#1A1818] font-display">LifeLink Pakistan</span>
            </div>
            <p className="text-sm text-[#9B9794] max-w-xs leading-relaxed">
              Connecting blood donors with lives in need. A free, trusted platform for Pakistan.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#9B9794] mb-3">Platform</p>
            <div className="space-y-2">
              {['Find Donors', 'Become a Donor', 'Emergency Request', 'How It Works'].map((link) => (
                <p key={link} className="text-sm text-[#6B6866] hover:text-[#1A1818] cursor-pointer transition-colors">
                  {link}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#9B9794] mb-3">Legal</p>
            <div className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((link) => (
                <p key={link} className="text-sm text-[#6B6866] hover:text-[#1A1818] cursor-pointer transition-colors">
                  {link}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[#E4E2DF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9B9794]">© 2026 LifeLink Pakistan. All rights reserved.</p>
          <div className="flex gap-3">
            {['Twitter', 'Facebook', 'Instagram'].map((s) => (
              <span key={s} className="text-xs text-[#9B9794] hover:text-[#C41230] cursor-pointer transition-colors">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
