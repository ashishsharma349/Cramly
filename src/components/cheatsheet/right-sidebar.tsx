'use client'

import { BookOpen, Flame, Clock, ChevronDown } from 'lucide-react'

export function RightSidebar() {
  const popularTopics = [
    'Python', 'DBMS', 'Operating System', 'DSA',
    'Computer Networks', 'OOPs', 'SQL', 'Machine Learning'
  ]

  return (
    <aside className="hidden lg:block space-y-6">

      {/* Popular Topics */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base">Popular Topics</h3>
          <a href="#" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTopics.map((topic) => (
            <button
              key={topic}
              className="px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-sm hover:border-primary/50 transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
