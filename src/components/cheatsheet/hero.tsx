// Renders the main marketing message and logo illustration in the dashboard.
export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
      <div className="max-w-xl">
        <h1 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-[64px]">
          Cramly —
          <br />
          <span className="text-primary">Learn Smarter. Revise Faster.</span>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed font-normal text-muted-foreground text-pretty sm:text-base">
          Generate concise, well-structured cheatsheets for any topic with Cramly.
          <br className="hidden sm:block" />
          Save time. Boost productivity. Ace your exams.
        </p>
      </div>
      <div className="relative shrink-0">
        <img
          src="/hero-doc.png"
          alt="Illustration of a cheatsheet document"
          className="h-auto w-48 object-contain lg:w-72"
        />
      </div>
    </section>
  )
}
