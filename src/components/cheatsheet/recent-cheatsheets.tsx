import { useState } from 'react'
import {
  ScrollText,
  Eye,
  Download,
  EllipsisVertical,
  ChevronRight,
  RefreshCw,
  Trash2,
  Terminal,
  FlaskConical,
  Calculator,
  Hourglass,
  Globe,
  Code2,
  Briefcase,
  Stethoscope,
  Scale,
  BookOpen,
  TrendingUp,
  Brain,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BADGE_STYLES, type BadgeLevel } from './data'

// Resolves a subject string to its corresponding Lucide icon.
const getSubjectIcon = (subject: string) => {
  const norm = (subject || '').toLowerCase()
  if (norm.includes('science')) return FlaskConical
  if (norm.includes('math')) return Calculator
  if (norm.includes('history')) return Hourglass
  if (norm.includes('geography')) return Globe
  if (norm.includes('programming')) return Code2
  if (norm.includes('business')) return Briefcase
  if (norm.includes('medicine')) return Stethoscope
  if (norm.includes('law')) return Scale
  if (norm.includes('literature')) return BookOpen
  if (norm.includes('economics')) return TrendingUp
  if (norm.includes('psychology')) return Brain
  if (norm.includes('engineering')) return Settings
  return Terminal
}

// Resolves a subject string to its style classes.
const getSubjectColors = (subject: string) => {
  const norm = (subject || '').toLowerCase()
  if (norm.includes('science')) return { bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400' }
  if (norm.includes('math')) return { bg: 'bg-indigo-100 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400' }
  if (norm.includes('history')) return { bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400' }
  if (norm.includes('geography')) return { bg: 'bg-cyan-100 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400' }
  if (norm.includes('programming')) return { bg: 'bg-violet-100 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400' }
  if (norm.includes('business')) return { bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400' }
  if (norm.includes('medicine')) return { bg: 'bg-red-100 dark:bg-red-950/40', text: 'text-red-600 dark:text-red-400' }
  if (norm.includes('law')) return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' }
  if (norm.includes('literature')) return { bg: 'bg-orange-100 dark:bg-orange-950/40', text: 'text-orange-600 dark:text-orange-400' }
  if (norm.includes('economics')) return { bg: 'bg-lime-100 dark:bg-lime-950/40', text: 'text-lime-600 dark:text-lime-400' }
  if (norm.includes('psychology')) return { bg: 'bg-fuchsia-100 dark:bg-fuchsia-950/40', text: 'text-fuchsia-600 dark:text-fuchsia-400' }
  if (norm.includes('engineering')) return { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-600 dark:text-zinc-400' }
  return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' }
}

// Normalizes lowercase level names to title case for badge lookup.
const getNormalizedLevel = (level: string): BadgeLevel => {
  const l = (level || '').toLowerCase()
  if (l === 'school') return 'School'
  if (l === 'college') return 'College'
  if (l === 'expert') return 'Expert'
  return 'School'
}

// Formats timestamps into readable localized dates.
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const VERIFICATION_BADGE_STYLES = {
  verified: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50',
  partially_verified: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50',
  syntax_verified: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50',
  unverified: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
}

const VERIFICATION_BADGE_LABELS = {
  verified: 'Verified',
  partially_verified: 'Partially Verified',
  syntax_verified: 'Syntax Verified',
  unverified: 'Unverified',
}

// Renders lists of generated cheatsheets with actions.
export function RecentCheatsheets({
  jobs,
  isGuest,
  onPreview,
  onDelete,
  onViewAllClick,
}: {
  jobs: any[]
  isGuest?: boolean
  onPreview: (job: any) => void
  onDelete: (jobId: string) => void
  onViewAllClick?: () => void
}) {
  const [activeMenuJobId, setActiveMenuJobId] = useState<string | null>(null)

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      {isGuest && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/10 p-3.5 text-xs text-amber-800 dark:text-amber-300">
          Guest history is stored only on this device. Sign up to save permanently.
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ScrollText className="size-5 text-primary" />
          Recent Cheatsheets
        </h2>
        {onViewAllClick && (
          <button
            type="button"
            onClick={onViewAllClick}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-4">
        {jobs.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No cheatsheets generated yet. Try creating one above!
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {jobs.map((job) => {
              const isCompleted = job.status === 'done'
              const isFailed = job.status === 'error'
              const isProcessing = job.status === 'processing' || job.status === 'pending'
              const IconComponent = getSubjectIcon(job.subject)
              const colors = getSubjectColors(job.subject)
              const badgeLevel = getNormalizedLevel(job.level)

              return (
                <li
                  key={job.jobId}
                  className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-xl',
                      colors.bg,
                    )}
                  >
                    <IconComponent className={cn('size-5', colors.text)} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {job.topic} Cheatsheet
                      </p>
                      <span
                        className={cn(
                          'rounded-md px-2 py-0.5 text-[11px] font-medium',
                          BADGE_STYLES[badgeLevel],
                        )}
                      >
                        {badgeLevel}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {isCompleted && (
                        <>
                          <span>{formatDate(job.completedAt || job.createdAt)}</span>
                          <span className="inline">•</span>
                          <span>{job.fileSize || '24 KB'}</span>
                        </>
                      )}
                      {isProcessing && (
                        <span className="flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400">
                          <RefreshCw className="size-3 animate-spin" />
                          Generating...
                        </span>
                      )}
                      {isFailed && (
                        <span
                          className="font-semibold text-destructive"
                          title={job.errorMessage || 'Unknown error occurred'}
                        >
                          Generation Failed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop actions */}
                  <div className="hidden items-center gap-2 sm:flex">
                    {isCompleted && (
                      <>
                        <button
                          type="button"
                          onClick={() => onPreview(job)}
                          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                          <Eye className="size-4" />
                          Preview
                        </button>
                        <a
                          href={job.downloadUrl || `/api/uploads/${job.jobId}.pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                          <Download className="size-4" />
                          Download
                        </a>
                      </>
                    )}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuJobId(
                            activeMenuJobId === job.jobId ? null : job.jobId,
                          )
                        }}
                        aria-label="More options"
                        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
                      >
                        <EllipsisVertical className="size-4" />
                      </button>
                      {activeMenuJobId === job.jobId && (
                        <div className="absolute right-0 top-10 z-10 w-32 rounded-xl border border-border bg-popover py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              onDelete(job.jobId)
                              setActiveMenuJobId(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-secondary"
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile action */}
                  <div className="flex items-center gap-1.5 sm:hidden">
                    {isCompleted && (
                      <>
                        <button
                          type="button"
                          onClick={() => onPreview(job)}
                          className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
                        >
                          <Eye className="size-5" />
                        </button>
                        <a
                          href={job.downloadUrl || `/api/uploads/${job.jobId}.pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex size-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
                        >
                          <Download className="size-5" />
                        </a>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(job.jobId)}
                      className="flex size-9 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
