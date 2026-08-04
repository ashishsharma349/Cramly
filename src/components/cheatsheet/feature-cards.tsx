'use client'

// Single-line comment describing purpose per AGENTS.md rule
// Renders responsive 'How it works' 3-step workflow section
export function FeatureCards() {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-10">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 relative z-10">
            <div className="h-24 sm:h-28 flex items-center justify-center md:justify-start">
              <img
                src="/step1-icon.png"
                alt="1. You enter a topic"
                className="h-20 sm:h-24 w-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                1. You enter a topic
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[240px]">
                Paste anything. Notes, PDFs, texts, or random thoughts.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 relative z-10">
            <div className="h-24 sm:h-28 flex items-center justify-center md:justify-start">
              <img
                src="/step2-icon.png"
                alt="2. AI processes & structures"
                className="h-20 sm:h-24 w-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                2. AI processes &amp; structures
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[240px]">
                Cramly reads, understands, and organizes the chaos.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 relative z-10">
            <div className="h-24 sm:h-28 flex items-center justify-center md:justify-start">
              <img
                src="/step3-icon.png"
                alt="3. You get one clean page"
                className="h-20 sm:h-24 w-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                3. You get one clean page
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[240px]">
                Structured, simplified, and ready to study or print.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
