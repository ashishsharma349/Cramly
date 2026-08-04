'use client'

const REASONS = [
  { title: 'Instant clarity', desc: 'Complex topics turned into clear, structured notes.' },
  { title: 'Exam focused', desc: 'Content is concise, relevant, and easy to revise.' },
  { title: 'Print ready', desc: 'Beautiful formatting that looks great on paper.' },
  { title: 'Saves hours', desc: 'What takes 3 hours to notes, Cramly does in 30 seconds.' },
  { title: 'Works everywhere', desc: 'Web based. Access your cheatsheets from any device.' },
  { title: 'Built for students', desc: 'Made by students, for students. No fluff, just value.' },
]

// Single-line comment describing purpose per AGENTS.md rule
// Renders the 'Why students love Cramly' specification table
export function WhyLoveCramly() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">
        Why students love Cramly
      </h2>

      <div className="divide-y divide-slate-100 border-t border-b border-slate-100 text-xs sm:text-sm">
        {REASONS.map((r) => (
          <div key={r.title} className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
            <span className="font-bold text-slate-900 min-w-[140px]">
              {r.title}
            </span>
            <span className="text-slate-600 font-normal flex-1">
              {r.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
