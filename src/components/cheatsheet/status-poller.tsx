import { RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

const STAGES = [
  "1. Structuring Curriculum...",
  "2. Gathering Authoritative Sources...",
  "3. Synthesizing Concepts...",
  "4. Verifying Factual Accuracy...",
  "5. Formatting Final Cheatsheet..."
]

// Renders the background job generation status card with loader indicators.
export function StatusPoller({ currentJob }: { currentJob: any }) {
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1)) // Don't loop, stick to last step if taking long
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  if (!currentJob) return null

  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-sm sm:p-6 lg:p-8 flex items-start gap-4 animate-pulse">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <RefreshCw className="size-5 text-primary animate-spin" />
      </div>
      <div className="space-y-1 w-full">
        <h4 className="text-sm font-semibold text-foreground">
          {currentJob.progress || 'Generating Cheatsheet...'}
        </h4>
        <div className="text-xs text-muted-foreground leading-relaxed min-h-[1.25rem]">
          <span key={stageIndex} className="inline-block animate-in fade-in slide-in-from-bottom-1 duration-500">
            {STAGES[stageIndex]}
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
  )
}
