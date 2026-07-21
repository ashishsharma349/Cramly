'use client'

export function Footer({ onNavigate }: { onNavigate?: (id: string) => void }) {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left - Logo & Copyright */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary">CS</span>
              </div>
              <span className="font-semibold">Cramly</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Cramly. All rights reserved.
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
            <div className="flex gap-4">
              <a href="/programming" className="text-muted-foreground hover:text-foreground transition-colors">Programming</a>
              <a href="/science" className="text-muted-foreground hover:text-foreground transition-colors">Science</a>
              <a href="/mathematics" className="text-muted-foreground hover:text-foreground transition-colors">Mathematics</a>
            </div>
            <div className="flex gap-4">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('about'); }} className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('contact'); }} className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.('tos'); }} className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>

          {/* Right - Social */}
          <div className="flex items-center gap-4">

            <a href="https://www.linkedin.com/in/ashish-sharma-8802a8346/" target="_blank" rel="noopener noreferrer" className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://instagram.com/ashish.sh__" target="_blank" rel="noopener noreferrer" className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
