'use client'

import { TopNavbar } from './top-navbar'
import { HomeHero } from './home-hero'
import { FeatureCards } from './feature-cards'
import { RightSidebar } from './right-sidebar'
import { Footer } from './footer'
import { RecentCheatsheets } from './recent-cheatsheets'

export function HomePage({
  jobs,
  onPreview,
  onDelete,
  onViewAllClick,
  onCreateClick,
  onNavigate
}: {
  jobs: any[]
  onPreview: (job: any) => void
  onDelete: (jobId: string) => void
  onViewAllClick: () => void
  onCreateClick: () => void
  onNavigate?: (id: string) => void
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <HomeHero onCreateClick={onCreateClick} />

          {/* Feature Cards */}
          <FeatureCards />

          {/* Recent + Stats Layout */}
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Recent Cheatsheets */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recent Cheatsheets</h2>
              </div>
              <RecentCheatsheets
                jobs={jobs}
                onPreview={onPreview}
                onDelete={onDelete}
                onViewAllClick={onViewAllClick}
              />
            </div>

            {/* Right Sidebar - Stats */}
            <RightSidebar />
          </div>

          {/* View All Link */}
          <div className="text-center border-t border-border pt-8">
            <button
              onClick={onViewAllClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all cheatsheets →
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
