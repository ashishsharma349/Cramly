'use client'

import { CheckCircle2, Code2, Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HomeHero({ 
  onCreateClick,
  title = "Cramly —",
  subtitle = "Learn Smarter. Revise Faster.",
  description = "Generate concise, well-structured cheat sheets for any topic with Cramly. Save time, boost productivity, and ace your learning."
}: { 
  onCreateClick: () => void
  title?: string
  subtitle?: string
  description?: string
}) {
  return (
    <section className="relative rounded-2xl border border-border bg-gradient-to-br from-background via-secondary/30 to-primary/5 overflow-hidden p-6 lg:p-8">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold leading-tight text-balance">
              {title} <br />
              <span className="text-primary">{subtitle}</span>
              <span className="ml-2 inline-block text-3xl">✨</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-md">
              {description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="rounded-lg gap-2 text-lg font-bold" onClick={onCreateClick}>
              <span>+</span> Create Cheatsheet
            </Button>
            <Button size="lg" variant="outline" className="rounded-lg gap-2">
              <span>📋</span> Explore Templates
            </Button>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Well Structured</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Download className="size-4 text-primary" />
              <span>PDF Export</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Printer className="size-4 text-primary" />
              <span>Print Ready</span>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative hidden lg:block ml-6">
          <div className="relative w-full h-[360px] flex items-center justify-center">
            {/* Decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/Home-hero.png"
                alt="Cheatsheet illustration"
                className="h-auto w-[445px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

