'use client'

import { Heart, Info } from 'lucide-react'

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
  onNavigate,
  onMenuClick
}: {
  jobs: any[]
  onPreview: (job: any) => void
  onDelete: (jobId: string) => void
  onViewAllClick: () => void
  onCreateClick: () => void
  onNavigate?: (id: string) => void
  onMenuClick?: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <TopNavbar onMenuClick={onMenuClick} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:pl-3 lg:pr-6 py-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero Section */}
          <HomeHero onCreateClick={onCreateClick} />

          {/* Story Behind Cramly Section */}
          <section className="relative rounded-2xl border border-border bg-card overflow-hidden">
            <div className="grid gap-12 lg:grid-cols-[1fr_300px] items-center p-8 lg:p-12">
              {/* Left: Story Text */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="size-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Why I Built Cramly</h2>
                </div>
                <div className="prose dark:prose-invert max-w-2xl text-muted-foreground space-y-4 leading-relaxed">
                  <p className="text-base">
                    Like many learners, I found myself jumping between textbooks, lecture slides, YouTube videos, blogs, and AI tools just to grasp a single topic. It was time-consuming, repetitive, and often left me with pages of notes but very little clarity.
                  </p>
                  <p className="text-base">
                    I wanted a way to turn scattered information into concise, structured revision material that could actually be read in one sitting.
                  </p>
                  <p className="text-base">
                    That's why I built Cramly. It's a solo passion project, built from scratch by an independent fresher developer.
                  </p>
                  <p className="text-base">
                    Behind the scenes, it combines AI with semantic search, retrieval, and automated fact-verification to make every cheatsheet as useful and reliable as possible. The project is still evolving, and every update improves its quality, accuracy, and coverage.
                  </p>
                  <p className="text-base">
                    If you ever spot something that could be explained better or corrected, I'd genuinely appreciate your feedback—it directly helps make Cramly better for everyone who uses it.
                  </p>
                  <p className="text-base font-medium text-foreground">
                    Thank you for giving Cramly a try. I hope it saves you time, makes learning a little less stressful, and becomes a tool you can rely on.
                  </p>
                </div>
                
                {/* Transparency Note */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-2">A Note on AI</h3>
                  <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/30 p-4">
                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Info className="size-3 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-foreground font-medium">No AI system is perfect.</strong> Cramly combines retrieval, verification, and multiple quality checks to maximize accuracy, but occasional mistakes are still possible. If you notice something that could be improved, please report it. Every report helps make future generations more accurate and reliable.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Student Illustration */}
              <div className="relative hidden lg:flex items-center justify-center mt-4">
                <img
                  src="/Stud-img.png"
                  alt="Student illustration"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </section>

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

