import { Menu, User } from 'lucide-react'

type MobileHeaderProps = {
  onMenu: () => void
}

// Renders the responsive mobile top navigation bar.
export function MobileHeader({ onMenu }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-secondary"
        >
          <Menu className="size-5" />
        </button>
        <img
          src="/bear-logo.png"
          alt="Cramly logo"
          className="size-9 object-contain"
        />
        <div className="leading-tight tracking-tight">
          <span className="block text-lg font-bold text-foreground">Cramly</span>
        </div>
      </div>
      <button
        type="button"
        aria-label="Account"
        className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
      >
        <User className="size-4" />
      </button>
    </header>
  )
}
