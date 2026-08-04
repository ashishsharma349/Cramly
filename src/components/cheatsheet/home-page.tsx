'use client'

import { HomeHero } from './home-hero'
import { FeatureCards } from './feature-cards'
import { WhyLoveCramly } from './why-love-cramly'
import { RecentCheatsheets } from './recent-cheatsheets'
import { Footer } from './footer'

// Single-line comment describing purpose per AGENTS.md rule
// Assembles the mobile-responsive HomePage reproducing drowningNotesHomeUI.png without top navbar
export function HomePage({
  jobs,
  isGuest,
  onPreview,
  onDelete,
  onViewAllClick,
  onCreateClick,
  onNavigate,
  onMenuClick,
}: {
  jobs: any[]
  isGuest: boolean
  onPreview: (job: any) => void
  onDelete: (jobId: string) => void
  onViewAllClick: () => void
  onCreateClick: () => void
  onNavigate?: (id: string) => void
  onMenuClick?: () => void
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-red-500/20 selection:text-red-600 overflow-x-hidden">
      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Hero Section starting directly at the top of the viewport */}
        <HomeHero onCreateClick={onCreateClick} />

        {/* How It Works (3 Steps) */}
        <FeatureCards />

        {/* Bottom 2-Column Section: Why Love Cramly + Recent Cheatsheets */}
        <section className="py-12 sm:py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left Column: Why students love Cramly */}
              <WhyLoveCramly />

              {/* Right Column: Your recent cheatsheets */}
              <RecentCheatsheets
                jobs={jobs}
                isGuest={isGuest}
                onPreview={onPreview}
                onDelete={onDelete}
                onViewAllClick={onViewAllClick}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
