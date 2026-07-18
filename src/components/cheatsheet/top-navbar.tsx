'use client'

import { Bell, ChevronDown, Plus, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from './auth-context'
import Image from 'next/image'

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()
  
  const displayName = user ? user.name : 'Guest'
  const initials = user ? user.name.substring(0, 2).toUpperCase() : 'G'

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3 lg:hidden">
          {onMenuClick && (
            <button onClick={onMenuClick} className="p-2 -ml-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
              <Menu className="size-5" />
            </button>
          )}
          <span className="font-bold text-lg tracking-tight">Cramly</span>
        </div>

        {/* Placeholder to keep Right Actions aligned to the right since we removed search */}
        <div className="hidden flex-1 lg:block"></div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Profile */}
          <button className="flex items-center gap-2.5 rounded-xl hover:bg-secondary/80 px-2 py-1.5 transition-colors border border-transparent hover:border-border/50">
            <div className="size-8 rounded-full bg-[#e8f3ec] dark:bg-emerald-950/40 flex items-center justify-center text-[#1b4332] dark:text-emerald-400 font-bold text-xs tracking-wide">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-foreground/90">{displayName}</p>
            </div>
            <ChevronDown className="size-4 text-muted-foreground/70 hidden md:block ml-1" />
          </button>
          
          {/* Logout Button if user is logged in */}
          {user && (
            <button onClick={logout} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-red-500" title="Log out">
              <LogOut className="size-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
