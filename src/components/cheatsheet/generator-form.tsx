import { useState } from 'react'
import {
  Search,
  BookOpen,
  ChartColumnBig,
  Send,
  ChevronDown,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LEVELS, SUBJECTS, type LevelId } from './data'

// Renders the label for each step in the generation form.
function StepLabel({
  icon: Icon,
  step,
  label,
}: {
  icon: typeof Search
  step: number
  label: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <Icon className="size-4 text-primary" />
      {step}. {label}
    </div>
  )
}

// Manages cheatsheet parameters, runs validation, and triggers generation.
export function GeneratorForm({
  onSubmit,
  isGenerating,
}: {
  onSubmit: (data: { topic: string; subject: string; level: LevelId; generationMode: string }) => void
  isGenerating: boolean
}) {
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [error, setError] = useState('')
  const [level, setLevel] = useState<LevelId>('school')
  const [generationMode, setGenerationMode] = useState('balanced')
  const [ceMode, setCeMode] = useState('fast')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!topic || topic.trim().length < 2) {
      setError('Topic must be at least 2 characters.')
      return
    }
    if (topic.length > 150) {
      setError('Topic must be maximum 150 characters.')
      return
    }
    if (!/^[a-zA-Z0-9\s\-]+$/.test(topic)) {
      setError('Topic can only contain letters, numbers, spaces, and dashes.')
      return
    }

    let finalSubject = subject
    if (subject === 'custom') {
      if (!customSubject || customSubject.trim().length < 2) {
        setError('Please enter a custom subject of at least 2 characters.')
        return
      }
      if (customSubject.length > 50) {
        setError('Custom subject must be maximum 50 characters.')
        return
      }
      finalSubject = customSubject.trim()
    }

    if (!finalSubject) {
      setError('Please select or enter a subject.')
      return
    }

    onSubmit({ topic: topic.trim(), subject: finalSubject, level, generationMode, ceMode })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8"
    >
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <StepLabel icon={Search} step={1} label="Topic" />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g., Photosynthesis, French Revolution, Calculus"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            Enter the topic you want a cheatsheet for
          </p>
        </div>

        <div className="space-y-2">
          <StepLabel icon={BookOpen} step={2} label="Subject" />
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                if (e.target.value !== 'custom') {
                  setCustomSubject('')
                }
              }}
              disabled={isGenerating}
              className={cn(
                'w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20',
                subject ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <option value="">Select a subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="custom">Other (type custom subject)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {subject === 'custom' && (
            <div className="mt-3">
              <input
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                disabled={isGenerating}
                placeholder="e.g., Science, History, Biology"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
          <p className="hidden text-xs text-muted-foreground lg:block">
            Choose the category that fits best
          </p>
        </div>

        <div className="space-y-2">
          <StepLabel icon={Layers} step={3} label="Generation Mode" />
          <div className="relative">
            <select
              value={generationMode}
              onChange={(e) => setGenerationMode(e.target.value)}
              disabled={isGenerating}
              className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
            >
              <option value="balanced">Balanced (Default)</option>
              <option value="concise">Concise</option>
              <option value="detailed" disabled>Detailed (Coming Soon)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Select the density and style of the cheatsheet
          </p>
        </div>

        <div className="space-y-2">
          <StepLabel icon={Layers} step={4} label="Speed / Accuracy" />
          <div className="relative">
            <select
              value={ceMode}
              onChange={(e) => setCeMode(e.target.value)}
              disabled={isGenerating}
              className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
            >
              <option value="fast">Fast (Standard)</option>
              <option value="accurate">Accurate (Slower)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Fast is usually good enough. Accurate is slower.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <StepLabel icon={ChartColumnBig} step={5} label="Level" />
        <div
          role="radiogroup"
          aria-label="Difficulty level"
          className="grid gap-3 sm:grid-cols-3"
        >
          {LEVELS.map((lvl) => {
            const selected = level === lvl.id
            return (
              <button
                key={lvl.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={isGenerating || lvl.disabled}
                onClick={() => setLevel(lvl.id)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-4 text-left transition-all',
                  lvl.disabled && 'opacity-50 cursor-not-allowed',
                  selected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    selected ? 'border-primary' : 'border-muted-foreground/40',
                  )}
                >
                  {selected && (
                    <span className="size-2.5 rounded-full bg-primary" />
                  )}
                </span>
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-xl',
                    lvl.iconWrap,
                  )}
                >
                  <lvl.icon className={cn('size-5', lvl.iconColor)} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {lvl.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {lvl.subtitle}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm font-semibold text-destructive">
          Error: {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isGenerating}
        className="mt-6 h-12 w-full rounded-2xl text-base"
      >
        <Send className="size-4" />
        {isGenerating ? 'Generating Cheatsheet...' : 'Generate Cheatsheet'}
      </Button>
    </form>
  )
}
