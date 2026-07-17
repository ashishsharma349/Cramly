'use client'

import { useEffect, useState } from 'react'
import { Play, User, X, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sidebar } from './sidebar'
import { MobileHeader } from './mobile-header'
import { BottomNav } from './bottom-nav'
import { Hero } from './hero'
import { GeneratorForm } from './generator-form'
import { RecentCheatsheets } from './recent-cheatsheets'

export function AppShell() {
  const [active, setActive] = useState('home')
  const [dark, setDark] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const navigate = (id: string) => {
    setActive(id)
    setDrawerOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        active={active}
        onNavigate={navigate}
        dark={dark}
        onToggleTheme={() => setDark((d) => !d)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <MobileHeader onMenu={() => setDrawerOpen(true)} />

        {/* Desktop top bar */}
        <div className="hidden items-center justify-end gap-3 px-8 pt-6 lg:flex">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Play className="size-4 text-primary" />
            How it works
          </button>
          <button
            type="button"
            aria-label="Account"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <User className="size-4" />
          </button>
        </div>

        <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Hero />
          <GeneratorForm />
          <RecentCheatsheets />
        </main>

        <BottomNav active={active} onNavigate={navigate} />
      </div>

      {/* Mobile nav drawer */}
      {drawerOpen && (
        <MobileDrawer
          active={active}
          onNavigate={navigate}
          onClose={() => setDrawerOpen(false)}
          dark={dark}
          onToggleTheme={() => setDark((d) => !d)}
        />
      )}
    </div>
  )
}

import { Home, FileText, Star, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'cheatsheets', label: 'My Cheatsheets', icon: FileText },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'profile', label: 'Profile', icon: UserIcon },
]

function MobileDrawer({
  active,
  onNavigate,
  onClose,
  dark,
  onToggleTheme,
}: {
  active: string
  onNavigate: (id: string) => void
  onClose: () => void
  dark: boolean
  onToggleTheme: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute top-0 left-0 flex h-full w-72 flex-col bg-sidebar p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-foreground">Cramly</span>{' '}
            <span className="text-primary">Generator</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV.map((item) => {
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
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

        <Button className="mt-6 w-full rounded-xl">Sign Up / Log In</Button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="mt-auto flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            {dark ? (
              <Moon className="size-4 text-primary" />
            ) : (
              <Sun className="size-4 text-primary" />
            )}
            {dark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span
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
          </span>
        </button>
      </div>
    </div>
  )
}
