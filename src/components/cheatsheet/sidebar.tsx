import {
  Home,
  FileText,
  Star,
  User,
  Sparkles,
  Sun,
  Moon,
  Wand2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'generate', label: 'Generate', icon: Wand2 },
  { id: 'cheatsheets', label: 'My Cheatsheets', icon: FileText },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'profile', label: 'Profile', icon: User },
]

type SidebarProps = {
  active: string
  onNavigate: (id: string) => void
  dark: boolean
  onToggleTheme: () => void
  onAuthClick?: () => void
  user?: any
  onLogout?: () => void
}

// Renders the desktop sidebar menu options and theme toggle controls.
export function Sidebar({
  active,
  onNavigate,
  dark,
  onToggleTheme,
  onAuthClick,
  user,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border/40 bg-sidebar p-6 lg:flex">
      <div className="flex items-center gap-2 -ml-2 mb-2">
        <img
          src="/bear-logo.png"
          alt="Cramly logo"
          className="size-24 object-contain scale-110"
        />
        <div className="leading-tight tracking-tight">
          <span className="block text-[32px] font-bold text-foreground">Cramly</span>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {!user ? (
        <div className="mt-8 rounded-2xl border border-border bg-secondary/50 p-5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="size-6 text-primary" />
          </div>
          <h3 className="mt-3 text-lg leading-snug font-semibold text-balance">
            Save & Organize Your Cheatsheets
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed font-normal text-muted-foreground text-pretty sm:text-base">
            Create an account to save, organize and access your cheatsheets
            anywhere.
          </p>
          <Button className="mt-4 w-full rounded-xl" onClick={onAuthClick}>Sign Up / Log In</Button>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-secondary/50 p-4">
          <div className="mb-2 px-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-background p-3 border border-border">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">Quota: <strong className={user.freeCheatsheetsRemaining === 0 ? "text-rose-500 font-bold" : "font-semibold"}>{user.freeCheatsheetsRemaining} left</strong></p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full mt-3 rounded-xl py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors border border-border">
            Log Out
          </button>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium">
          {dark ? (
            <Moon className="size-4 text-primary" />
          ) : (
            <Sun className="size-4 text-primary" />
          )}
          {dark ? 'Dark Mode' : 'Light Mode'}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={dark}
          aria-label="Toggle dark mode"
          onClick={onToggleTheme}
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors',
            dark ? 'bg-primary' : 'bg-primary/40',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 size-5 rounded-full bg-card shadow transition-transform',
              dark ? 'translate-x-5' : 'translate-x-0.5',
            )}
          />
        </button>
      </div>
    </aside>
  )
}
