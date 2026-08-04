import { useState, useEffect } from 'react'
import {
  Sparkles,
  Download,
  ThumbsUp,
  ThumbsDown,
  X,
  RefreshCw,
  Wand2,
  AlertTriangle,
  Star,
} from 'lucide-react'

export type LiveA4ModalSection = {
  index: number
  heading: string
  status: 'skeleton' | 'done'
  description?: string
}

export type LiveA4ModalProps = {
  isOpen: boolean
  onClose: () => void
  isFavorite?: boolean
  onToggleFavorite?: () => void
  job: {
    jobId?: string
    _id?: string
    topic?: string
    subject?: string
    level?: string
    status?: 'generating' | 'done' | 'error'
    stageLabel?: string
    sections?: LiveA4ModalSection[]
    pdfUrl?: string | null
    fileUrl?: string | null
    downloadUrl?: string | null
    cheatsheetJSON?: any
    errorMessage?: string
  } | null
  isGenerating?: boolean
}

// Renders the Live A4 Cheatsheet Modal matching the Cramly design system
export function LiveA4Modal({ isOpen, onClose, isFavorite, onToggleFavorite, job, isGenerating }: LiveA4ModalProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFeedback(null)
    }
  }, [isOpen, job?.jobId, job?._id])

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && (window as any).renderMathInElement) {
      const timer = setTimeout(() => {
        try {
          (window as any).renderMathInElement(document.body, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false }
            ]
          })
        } catch (e) {
          // ignore math render errors
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, job?.sections, job?.cheatsheetJSON])

  if (!isOpen || !job) return null

  const topicTitle = job.topic || job.cheatsheetJSON?.title || 'Cheatsheet'
  const subjectName = job.subject || 'General'
  const levelName = job.level || 'college'
  const currentStage = job.stageLabel || (job.status === 'done' ? 'Generation Complete' : 'Processing...')
  const pdfDownloadUrl = job.pdfUrl || job.fileUrl || job.downloadUrl || (job.jobId || job._id ? `/uploads/${job.jobId || job._id}.pdf` : null)

  // Derive sections list from either live streaming state or completed cheatsheetJSON
  let sectionItems: LiveA4ModalSection[] = []
  if (job.sections && job.sections.length > 0) {
    sectionItems = job.sections
  } else if (job.cheatsheetJSON?.sections) {
    sectionItems = job.cheatsheetJSON.sections.map((s: any, idx: number) => ({
      index: idx,
      heading: s.name || s.heading,
      status: 'done',
      description: s.description
    }))
  }

  const handleVote = async (type: 'up' | 'down') => {
    if (feedback) return
    setFeedback(type)
    const activeId = job.jobId || job._id
    if (activeId && activeId !== 'pending') {
      try {
        await fetch(`/api/jobs/${activeId}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating: type })
        })
      } catch (e) {
        console.error('Failed to submit feedback:', e)
      }
    }
  }

  const handleDownload = () => {
    const activeId = job.jobId || job._id
    if (activeId && activeId !== 'pending') {
      fetch(`/api/jobs/${activeId}/analytics`, { method: 'POST' }).catch(() => {})
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-screen h-screen bg-slate-900/40 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      
      {/* Fixed Header Bar */}
      <header className="h-16 px-6 sm:px-8 border-b border-slate-200 bg-white/95 text-slate-900 flex items-center justify-between shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-[#FF4D4D] font-bold border border-red-100">
            <Wand2 className="size-4" />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              {topicTitle}
              <span className="text-[10px] border border-slate-200 px-2 py-0.5 rounded-md text-slate-500 uppercase tracking-wider font-semibold">
                {subjectName} • {levelName}
              </span>
            </h3>
            <p className={`text-xs flex items-center gap-2 ${job.status === 'error' ? 'text-red-500' : 'text-slate-500'}`}>
              {isGenerating && job.status !== 'error' && <RefreshCw className="size-3 motion-safe:animate-spin text-[#FF4D4D]" />}
              {job.status === 'error' && <AlertTriangle className="size-3" />}
              {currentStage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`size-9 rounded-xl flex items-center justify-center border transition ${
                isFavorite
                  ? 'bg-red-50 border-[#FF4D4D] text-[#FF4D4D]'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Star className={`size-4 ${isFavorite ? 'fill-[#FF4D4D]' : ''}`} />
            </button>
          )}
          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
            title="Close workspace"
          >
            <X className="size-5" />
          </button>
        </div>
      </header>

      {/* Central Scrollable Workspace (A4 Canvas) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 flex justify-center items-start bg-[#FAFAF8] overflow-x-hidden relative">
        <div className="w-full sm:w-[210mm] sm:min-h-[297mm] bg-white text-slate-900 p-6 sm:p-[15mm] rounded-2xl shadow-xl font-sans text-xs border border-slate-200/90 flex flex-col justify-between my-auto transition-all relative z-10">
          <div>
            {/* A4 Document Header */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#FF4D4D] uppercase tracking-widest block mb-1">
                  {subjectName} • {levelName} Level
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {topicTitle}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  CRAMLY CHEATSHEET
                </span>
                <span className="text-[9px] text-slate-400">Live AI Stream</span>
              </div>
            </div>

            {/* Skeletons / Sections Grid */}
            {job.status === 'error' ? (
              <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-red-100 p-4">
                  <AlertTriangle className="size-10 text-red-600" />
                </div>
                <h3 className="font-bold text-xl text-slate-900">Generation Failed</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm">
                  {job.errorMessage || 'The connection to the AI generation service failed. Please close this window and try again.'}
                </p>
              </div>
            ) : sectionItems.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Sparkles className="size-8 motion-safe:animate-spin text-[#FF4D4D]" />
                <p className="text-sm font-medium text-slate-600">Generating domain curriculum & layout grid...</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                {sectionItems.map((sec) => (
                  <div
                    key={sec.index}
                    className={`break-inside-avoid rounded-xl border p-3.5 transition-all duration-300 ${
                      sec.status === 'done'
                        ? 'border-slate-200 bg-slate-50/50 shadow-xs'
                        : 'border-dashed border-red-300 bg-red-50/20 motion-safe:animate-pulse'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        {sec.heading}
                      </h3>
                      {sec.status !== 'done' && (
                        <span className="text-[9px] font-medium text-[#FF4D4D] bg-red-50 px-1.5 py-0.5 rounded">
                          Generating...
                        </span>
                      )}
                    </div>

                    {sec.status === 'done' ? (
                      <div
                        className="text-[10.5px] leading-relaxed text-slate-700 space-y-1.5"
                        dangerouslySetInnerHTML={{ __html: sec.description || '' }}
                      />
                    ) : (
                      <div className="space-y-2 py-1">
                        <div className="h-2.5 bg-red-100 rounded w-full motion-safe:animate-pulse" />
                        <div className="h-2.5 bg-red-100/70 rounded w-4/5 motion-safe:animate-pulse" />
                        <div className="h-2.5 bg-red-100/40 rounded w-3/5 motion-safe:animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* A4 Document Footer */}
          <div className="border-t border-slate-200 pt-3 mt-6 flex items-center justify-between text-[9px] text-slate-400 font-mono">
            <span>Cramly AI Cheatsheet Generator</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </main>

      {/* Fixed Footer Bar */}
      <footer className="h-16 px-6 sm:px-8 border-t border-slate-200 bg-white/95 text-slate-900 flex items-center justify-between shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Was this live preview helpful?</span>
          <button
            onClick={() => handleVote('up')}
            className={`p-1.5 rounded-lg border transition ${
              feedback === 'up'
                ? 'bg-red-50 border-[#FF4D4D] text-[#FF4D4D]'
                : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Thumbs Up"
          >
            <ThumbsUp className="size-4" />
          </button>
          <button
            onClick={() => handleVote('down')}
            className={`p-1.5 rounded-lg border transition ${
              feedback === 'down'
                ? 'bg-rose-50 border-rose-500 text-rose-600'
                : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Thumbs Down"
          >
            <ThumbsDown className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
          >
            Close Workspace
          </button>

          {job.status === 'done' || pdfDownloadUrl ? (
            <a
              href={pdfDownloadUrl || '#'}
              download
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold shadow-sm transition"
            >
              <Download className="size-4" />
              Download PDF
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed opacity-60"
            >
              <Download className="size-4" />
              Compiling PDF...
            </button>
          )}
        </div>
      </footer>

    </div>
  )
}
