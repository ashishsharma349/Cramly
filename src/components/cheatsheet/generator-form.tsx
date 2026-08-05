'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Search,
  BookOpen,
  ChartColumnBig,
  Send,
  ChevronDown,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LEVELS, SUBJECTS, type LevelId } from './data'

// Renders step label with black bold text and coral-red outline icon
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
    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
      <Icon className="size-4 text-[#FF4D4D]" />
      {step}. {label}
    </div>
  )
}

// Manages cheatsheet parameters, runs validation, and triggers generation with coral-red style
export function GeneratorForm({
  onSubmit,
  isGenerating,
}: {
  onSubmit: (data: { topic: string; subject: string; level: LevelId; generationMode: string; ceMode: string }) => void
  isGenerating: boolean
}) {
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [error, setError] = useState('')
  const [level, setLevel] = useState<LevelId>('school')
  const [generationMode, setGenerationMode] = useState('balanced')
  const [ceMode, setCeMode] = useState('fast')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!topic || topic.trim().length < 2) {
      const msg = 'Topic must be at least 2 characters.'
      setError(msg)
      toast.error(msg)
      return
    }
    if (topic.length > 150) {
      const msg = 'Topic must be maximum 150 characters.'
      setError(msg)
      toast.error(msg)
      return
    }
    if (!/^[a-zA-Z0-9\s\-]+$/.test(topic)) {
      const msg = 'Topic can only contain letters, numbers, spaces, and dashes.'
      setError(msg)
      toast.error(msg)
      return
    }

    if (!subject) {
      const msg = 'Please select a subject.'
      setError(msg)
      toast.error(msg)
      return
    }

    onSubmit({ topic: topic.trim(), subject, level, generationMode, ceMode })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-8 shadow-sm space-y-6"
    >
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {/* Step 1: Topic */}
        <div className="space-y-2">
          <StepLabel icon={Search} step={1} label="Topic" />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g., Photosynthesis, French Revolution, Calculus"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#FF4D4D] focus:ring-2 focus:ring-red-500/20"
          />
          <p className="text-xs text-slate-500">
            Enter the topic you want a cheatsheet for
          </p>
        </div>

        {/* Step 2: Subject */}
        <div className="space-y-2">
          <StepLabel icon={BookOpen} step={2} label="Subject" />
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isGenerating}
              className={cn(
                'w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#FF4D4D] focus:ring-2 focus:ring-red-500/20',
                subject ? 'text-slate-900' : 'text-slate-400',
              )}
            >
              <option value="">Select a subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <p className="hidden text-xs text-slate-500 lg:block">
            Choose the category that fits best
          </p>
        </div>

        {/* Step 3: Generation Mode */}
        <div className="space-y-2">
          <StepLabel icon={Layers} step={3} label="Generation Mode" />
          <div className="relative">
            <select
              value={generationMode}
              onChange={(e) => setGenerationMode(e.target.value)}
              disabled={isGenerating}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#FF4D4D] focus:ring-2 focus:ring-red-500/20"
            >
              <option value="balanced">Balanced (Default)</option>
              <option value="concise">Concise</option>
              <option value="detailed" disabled>Detailed (Coming Soon)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">
            Select the density and style of the cheatsheet
          </p>
        </div>

        {/* Step 4: Speed / Accuracy */}
        <div className="space-y-2">
          <StepLabel icon={Layers} step={4} label="Speed / Accuracy" />
          <div className="relative">
            <select
              value={ceMode}
              onChange={(e) => setCeMode(e.target.value)}
              disabled={isGenerating}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#FF4D4D] focus:ring-2 focus:ring-red-500/20"
            >
              <option value="fast">Fast (Standard)</option>
              <option value="accurate">Accurate (Slower)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">
            Fast is usually good enough. Accurate is slower.
          </p>
        </div>
      </div>

      {/* Step 5: Level Selector */}
      <div className="space-y-3 pt-2">
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
                  'flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                  lvl.disabled && 'opacity-50 cursor-not-allowed',
                  selected
                    ? 'border-[#FF4D4D] bg-red-50/40 ring-1 ring-[#FF4D4D]'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    selected ? 'border-[#FF4D4D]' : 'border-slate-300',
                  )}
                >
                  {selected && (
                    <span className="size-2.5 rounded-full bg-[#FF4D4D]" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900">
                    {lvl.title}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {lvl.subtitle}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="text-sm font-semibold text-red-500">
          Error: {error}
        </div>
      )}

      {/* Primary Submit Button matching Homepage CTA */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold text-base shadow-md shadow-red-500/20 transition-all disabled:opacity-50"
      >
        <Send className="size-4" />
        {isGenerating ? 'Generating Cheatsheet...' : 'Generate Cheatsheet'}
      </button>
    </form>
  )
}
