'use client'

import { ArrowRight } from 'lucide-react'

// Single-line comment describing purpose per AGENTS.md rule
// Renders responsive Hero section starting at viewport top without top navbar
export function HomeHero({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24 lg:pt-16 lg:pb-36 bg-slate-50/50">
      {/* Background collage of scattered notes starting at top of page */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80 pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: "url('/drowning-notes-bg.png')" }}
      />
      {/* Smooth gradient mask to transition into content below */}
      <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto pt-2 pb-6 sm:pb-10">
          {/* Main Headline */}
          <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight px-2">
            Stop drowning in notes.
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-md px-2">
            Cramly condenses any topic into one structured, print-ready page.
          </p>

          {/* Primary CTA Button */}
          <div className="mt-5 sm:mt-6 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={onCreateClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-7 sm:px-8 py-3.5 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold text-base shadow-md shadow-red-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Create your cheatsheet</span>
              <ArrowRight className="size-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Floating Cheatsheet Document */}
        <div className="relative mt-6 sm:mt-8 lg:-mt-12 flex justify-center lg:justify-end px-2 sm:px-6 lg:pr-12">
          <div className="w-full max-w-[540px] bg-white rounded-xl border border-slate-200/90 shadow-xl lg:shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-4 sm:p-6 lg:p-8 transform rotate-0 lg:rotate-[3deg] transition-transform duration-300">
            {/* Document Header */}
            <div className="border-b border-slate-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Data Structures
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Stack (LIFO)
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Last In, First Out
              </p>
            </div>

            {/* Document Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs text-slate-700">
              {/* Left Column */}
              <div className="space-y-3 sm:space-y-4">
                {/* 1. Overview */}
                <div>
                  <h3 className="font-bold text-slate-900 text-xs mb-1">
                    1. Overview
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 leading-snug">
                    <li>Stack is a linear data structure.</li>
                    <li>It follows LIFO principle.</li>
                    <li>Insertion and deletion happen at Top.</li>
                    <li>Common ops: Push, Pop, Peek.</li>
                  </ul>

                  {/* Stack Visual Diagram */}
                  <div className="mt-2.5 p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-center gap-2 text-[10px] font-mono text-slate-600">
                    <span className="text-slate-400">Top &rarr;</span>
                    <div className="flex flex-col border border-slate-300 rounded bg-white w-12 text-center divide-y divide-slate-200">
                      <span className="py-0.5 bg-slate-100 font-semibold">40</span>
                      <span className="py-0.5">30</span>
                      <span className="py-0.5">20</span>
                      <span className="py-0.5">10</span>
                    </div>
                    <span className="text-slate-400">&larr; Bottom</span>
                  </div>
                </div>

                {/* 2. Operations Table */}
                <div>
                  <h3 className="font-bold text-slate-900 text-xs mb-1">
                    2. Operations
                  </h3>
                  <div className="border border-slate-200 rounded overflow-x-auto text-[10px]">
                    <table className="w-full text-left border-collapse min-w-[200px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                          <th className="p-1">Operation</th>
                          <th className="p-1">Description</th>
                          <th className="p-1 text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        <tr>
                          <td className="p-1 font-mono font-medium">Push(x)</td>
                          <td className="p-1">Adds x to top</td>
                          <td className="p-1 text-right font-mono">O(1)</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-mono font-medium">Pop()</td>
                          <td className="p-1">Removes top</td>
                          <td className="p-1 text-right font-mono">O(1)</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-mono font-medium">Peek()</td>
                          <td className="p-1">Returns top</td>
                          <td className="p-1 text-right font-mono">O(1)</td>
                        </tr>
                        <tr>
                          <td className="p-1 font-mono font-medium">isEmpty()</td>
                          <td className="p-1">Checks empty</td>
                          <td className="p-1 text-right font-mono">O(1)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3 sm:space-y-4">
                {/* 3. Implementation (Python) */}
                <div>
                  <h3 className="font-bold text-slate-900 text-xs mb-1">
                    3. Implementation (Python)
                  </h3>
                  <pre className="p-2 bg-slate-50 rounded border border-slate-200 text-[10px] font-mono text-slate-800 leading-relaxed overflow-x-auto max-h-40 sm:max-h-none">
{`class Stack:
  def __init__(self):
    self.items = []

  def push(self, item):
    self.items.append(item)

  def pop(self):
    if self.isEmpty():
      return "Stack is empty"
    return self.items.pop()

  def isEmpty(self):
    return len(self.items) == 0`}
                  </pre>
                </div>

                {/* 4. Use Cases */}
                <div>
                  <h3 className="font-bold text-slate-900 text-xs mb-1">
                    4. Use Cases
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 leading-snug">
                    <li>Function call management</li>
                    <li>Expression evaluation</li>
                    <li>Syntax parsing</li>
                    <li>Undo/Redo operations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Tip Box */}
            <div className="mt-3 sm:mt-4 p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-[10px] sm:text-[11px] text-slate-600 italic">
              Tip: Think of a stack like a stack of plates &mdash; you can only add or remove from the top.
            </div>

            {/* Caption beneath floating document */}
            <div className="mt-2 text-right lg:absolute lg:-bottom-8 lg:right-4 text-xs text-slate-500 font-medium italic underline decoration-slate-300">
              Generated in 30 seconds. Print-ready.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
