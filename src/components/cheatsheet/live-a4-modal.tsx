import { useState, useEffect } from 'react'
import {
  Sparkles,
  Download,
  ThumbsUp,
  ThumbsDown,
  X,
  RefreshCw,
  Wand2
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
  } | null
  isGenerating?: boolean
}

export function LiveA4Modal({ isOpen, onClose, job, isGenerating }: LiveA4ModalProps) {
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
    <div className="fixed inset-0 z-50 flex flex-col w-screen h-screen bg-black/40 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      
      {/* Fixed Header Bar */}
      <header className="h-16 px-6 sm:px-8 border-b border-border bg-card/95 text-foreground flex items-center justify-between shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold border border-primary/20">
            <Wand2 className="size-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              {topicTitle}
              <span className="text-[10px] border border-border px-2 py-0.5 rounded-md text-muted-foreground uppercase tracking-wider font-semibold">
                {subjectName} • {levelName}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              {isGenerating && <RefreshCw className="size-3 animate-spin text-primary" />}
              {currentStage}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="size-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition"
          title="Close workspace (generation continues in background)"
        >
          <X className="size-5" />
        </button>
      </header>

      {/* Central Scrollable Workspace (A4 Canvas) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 flex justify-center items-start bg-background">
        <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[15mm] rounded-sm shadow-xl font-sans text-xs border border-slate-200 flex flex-col justify-between my-auto transition-all">
          <div>
            {/* A4 Document Header */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                  {subjectName} • {levelName} Level
                </span>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
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
            {sectionItems.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Sparkles className="size-8 animate-spin text-emerald-600" />
                <p className="text-sm font-medium">Generating domain curriculum & layout grid...</p>
              </div>
            ) : (
              <div className="columns-2 gap-4 space-y-4">
                {sectionItems.map((sec) => (
                  <div
                    key={sec.index}
                    className={`break-inside-avoid rounded-lg border p-3.5 transition-all duration-300 ${
                      sec.status === 'done'
                        ? 'border-slate-200 bg-slate-50/50 shadow-xs'
                        : 'border-dashed border-emerald-400/60 bg-emerald-50/20 animate-pulse'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        {sec.heading}
                      </h3>
                      {sec.status !== 'done' && (
                        <span className="text-[9px] font-medium text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
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
                        <div className="h-2.5 bg-emerald-200/60 rounded w-full animate-pulse" />
                        <div className="h-2.5 bg-emerald-200/40 rounded w-4/5 animate-pulse" />
                        <div className="h-2.5 bg-emerald-200/30 rounded w-3/5 animate-pulse" />
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
      <footer className="h-16 px-6 sm:px-8 border-t border-border bg-card/95 text-foreground flex items-center justify-between shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Was this live preview helpful?</span>
          <button
            onClick={() => handleVote('up')}
            className={`p-1.5 rounded-lg border transition ${
              feedback === 'up'
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            title="Thumbs Up"
          >
            <ThumbsUp className="size-4" />
          </button>
          <button
            onClick={() => handleVote('down')}
            className={`p-1.5 rounded-lg border transition ${
              feedback === 'down'
                ? 'bg-red-500/10 border-red-500 text-red-600'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            title="Thumbs Down"
          >
            <ThumbsDown className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-secondary transition"
          >
            Close Workspace
          </button>

          {job.status === 'done' || pdfDownloadUrl ? (
            <a
              href={pdfDownloadUrl || '#'}
              download
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition"
            >
              <Download className="size-4" />
              Download PDF
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold cursor-not-allowed opacity-60"
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
