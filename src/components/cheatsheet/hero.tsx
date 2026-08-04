'use client'

// Renders the Hero banner on the Generate page with black headlines and hand-drawn line art illustration
export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left py-4">
      <div className="max-w-xl">
        <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-slate-900">
          Cramly &mdash;
          <br />
          <span className="text-slate-900">Learn Smarter. Revise Faster.</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed font-normal text-slate-600">
          Generate concise, well-structured cheatsheets for any topic with Cramly.
          <br className="hidden sm:block" />
          Save time. Boost productivity. Ace your exams.
        </p>
      </div>
      <div className="relative shrink-0">
        <img
          src="/step3-icon.png"
          alt="Illustration of a structured cheatsheet document"
          className="h-auto w-36 object-contain lg:w-48 opacity-90 filter drop-shadow-sm"
        />
      </div>
    </section>
  )
}
