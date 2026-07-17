'use client'

import { Zap, FileText, Target, BookOpen, Download, Star } from 'lucide-react'

const FEATURES = [
  {
    id: 1,
    icon: Zap,
    title: 'Instant Generation',
    description: 'Create in seconds with AI power',
    colorText: 'text-green-600',
    colorBg: 'bg-green-50',
  },
  {
    id: 2,
    icon: FileText,
    title: 'Well Structured',
    description: 'Organized, concise and easy to understand',
    colorText: 'text-purple-600',
    colorBg: 'bg-purple-50',
  },
  {
    id: 3,
    icon: Target,
    title: 'Exam Focused',
    description: 'Perfect for quick revision and better scores',
    colorText: 'text-orange-600',
    colorBg: 'bg-orange-50',
  },
  {
    id: 4,
    icon: BookOpen,
    title: 'Any Subject',
    description: 'From CS to Biology, we\'ve got you covered',
    colorText: 'text-blue-600',
    colorBg: 'bg-blue-50',
  },
  {
    id: 5,
    icon: Download,
    title: 'Export Anywhere',
    description: 'Download as PDF, Markdown & more',
    colorText: 'text-pink-600',
    colorBg: 'bg-pink-50',
  },
  {
    id: 6,
    icon: Star,
    title: 'Customizable',
    description: 'Choose style, length & content you need',
    colorText: 'text-cyan-600',
    colorBg: 'bg-cyan-50',
  },
]

export function FeatureCards() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.id}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.colorBg}`}>
                <Icon className={`size-5 ${feature.colorText}`} />
              </div>
              <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
