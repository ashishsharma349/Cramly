'use client'

import { Home, FileText, Star, User, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'generate', label: 'Generate', icon: Wand2 },
  { id: 'cheatsheets', label: 'My Cheatsheets', icon: FileText },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'profile', label: 'Profile', icon: User },
]

type BottomNavProps = {
  active: string
  onNavigate: (id: string) => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-border bg-card/95 px-2 py-2 backdrop-blur lg:hidden">
      {NAV.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 rounded-lg py-1 text-[11px] font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
