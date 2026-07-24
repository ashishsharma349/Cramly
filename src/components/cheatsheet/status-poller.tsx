import { RefreshCw, Eye } from 'lucide-react'

// Renders the background job generation status card with real-time SSE stage indicators.
export function StatusPoller({ currentJob, onOpenCanvas }: { currentJob: any; onOpenCanvas?: () => void }) {
  if (!currentJob) return null

  const displayStage = currentJob.label || currentJob.stageLabel || currentJob.progressStage || currentJob.progress || 'Processing...';

  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-sm sm:p-6 lg:p-8 flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <RefreshCw className="size-5 text-primary animate-spin" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground">
            Generating Cheatsheet...
          </h4>
          <div className="text-xs text-muted-foreground leading-relaxed min-h-[1.25rem]">
            <span key={displayStage} className="inline-block animate-in fade-in slide-in-from-bottom-1 duration-500 font-medium">
              {displayStage}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/70 pt-1">
            Topic: <strong className="text-foreground/80">{currentJob.topic}</strong> ({currentJob.level})
          </p>
          {currentJob.attempts > 0 && (
            <span className="block text-[11px] font-semibold text-primary mt-1">
              Attempt {currentJob.attempts} of {currentJob.maxAttempts || 3}
            </span>
          )}
        </div>
      </div>

      {onOpenCanvas && (
        <button
          onClick={onOpenCanvas}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 transition shrink-0"
        >
          <Eye className="size-4" />
          Open Live Canvas
        </button>
      )}
    </div>
  )
}
