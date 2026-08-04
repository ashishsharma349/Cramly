'use client'

import { Trash2, Eye, Star } from 'lucide-react'

interface JobItem {
  jobId?: string
  _id?: string
  topic: string
  subject: string
  level: string
  createdAt?: string
  completedAt?: string
  status?: string
}

// Map subject names to subtle accent dot colors
const SUBJECT_COLORS: Record<string, string> = {
  'Computer Science': 'bg-blue-500',
  'Biology': 'bg-emerald-500',
  'Physics': 'bg-amber-500',
  'Geography': 'bg-purple-500',
  'Mathematics': 'bg-indigo-500',
  'Chemistry': 'bg-rose-500',
  'History': 'bg-amber-600',
}

// Renders the My Cheatsheets card table matching the approved design system
export function RecentCheatsheets({
  jobs = [],
  favorites = [],
  onPreview,
  onDelete,
  onToggleFavorite,
  onViewAllClick,
  showTitle = true,
}: {
  jobs?: any[]
  favorites?: any[]
  isGuest?: boolean
  onPreview?: (job: any) => void
  onDelete?: (jobId: string) => void
  onToggleFavorite?: (job: any) => void
  onViewAllClick?: () => void
  showTitle?: boolean
}) {
  // Default mock jobs matching reference if none present
  const displayJobs: JobItem[] = jobs.length > 0 ? jobs : [
    { jobId: '1', topic: 'Stack (LIFO)', subject: 'Computer Science', level: 'College', createdAt: '2024-05-22' },
    { jobId: '2', topic: 'Photosynthesis', subject: 'Biology', level: 'School', createdAt: '2024-05-21' },
    { jobId: '3', topic: "Newton's Laws", subject: 'Physics', level: 'School', createdAt: '2024-05-20' },
    { jobId: '4', topic: 'Plate Tectonics', subject: 'Geography', level: 'School', createdAt: '2024-05-19' },
  ]

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'May 22, 2024'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isStarred = (jobId: string) => {
    return favorites.some((f) => (f.jobId || f._id) === jobId)
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-8 shadow-sm space-y-4">
      {showTitle && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Your recent cheatsheets
          </h3>
          {onViewAllClick && (
            <button
              onClick={onViewAllClick}
              className="text-xs font-semibold text-[#FF4D4D] hover:underline"
            >
              View all
            </button>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 pr-4">Topic</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayJobs.map((job, idx) => {
              const dotColor = SUBJECT_COLORS[job.subject] || 'bg-slate-400'
              const jobId = job.jobId || job._id || String(idx)
              const starred = isStarred(jobId)

              return (
                <tr
                  key={jobId}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className={`size-2 rounded-full ${dotColor} shrink-0`} />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {job.topic}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium text-xs sm:text-sm">
                    {job.subject}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {job.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {formatDate(job.createdAt || job.completedAt)}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite(job)
                          }}
                          className="p-1 transition-colors"
                          title={starred ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Star className={`size-3.5 ${starred ? "fill-[#FF4D4D] text-[#FF4D4D]" : "text-slate-400 hover:text-[#FF4D4D]"}`} />
                        </button>
                      )}
                      <button
                        onClick={() => onPreview?.(job)}
                        className="text-xs font-semibold text-[#FF4D4D] hover:underline inline-flex items-center gap-1"
                      >
                        <Eye className="size-3.5" />
                        <span>Preview</span>
                      </button>
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(jobId)
                          }}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Delete cheatsheet"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
