import { Menu, User } from 'lucide-react'

type MobileHeaderProps = {
  onMenu: () => void
}

// Single-line comment describing purpose per AGENTS.md rule
// Renders the responsive light-themed mobile top navigation bar
export function MobileHeader({ onMenu }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Menu className="size-5" />
        </button>
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
          Cramly
        </span>
      </div>
      <button
        type="button"
        aria-label="Account"
        className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
      >
        <User className="size-4" />
      </button>
    </header>
  )
}
