'use client'

// Single-line comment describing purpose per AGENTS.md rule
// Renders responsive footer with subject links, static links, and social links matching original UI
export function Footer({ onNavigate }: { onNavigate?: (id: string) => void }) {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 sm:py-8 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm">
        {/* Left: Brand Wordmark & Copyright */}
        <div className="flex items-center gap-4">
          <div className="font-bold text-base text-slate-900 tracking-tight">
            Cramly
          </div>
          <div className="text-slate-400 text-xs">
            &copy; 2026 Cramly. All rights reserved.
          </div>
        </div>

        {/* Center: Subject & Page Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-slate-600 font-medium">
          <button
            onClick={() => onNavigate?.('about')}
            className="hover:text-slate-900 transition-colors"
          >
            About
          </button>
          <button
            onClick={() => onNavigate?.('contact')}
            className="hover:text-slate-900 transition-colors"
          >
            Contact
          </button>
          <button
            onClick={() => onNavigate?.('tos')}
            className="hover:text-slate-900 transition-colors"
          >
            Terms of Service
          </button>
        </div>

        {/* Right: Social Links */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/ashish-sharma-8802a8346/"
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label="LinkedIn"
          >
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href="https://instagram.com/ashish.sh__"
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label="Instagram"
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
