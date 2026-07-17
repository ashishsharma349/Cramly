'use client'

import { Bell, ChevronDown, Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from './auth-context'
import Image from 'next/image'

export function TopNavbar() {
  const { user, logout } = useAuth()
  
  const displayName = user ? user.name : 'Guest'
  const initials = user ? user.name.substring(0, 2).toUpperCase() : 'G'

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        {/* Placeholder to keep Right Actions aligned to the right since we removed search */}
        <div className="hidden flex-1 lg:block"></div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Profile */}
          <button className="flex items-center gap-2 rounded-lg hover:bg-secondary px-3 py-2 transition-colors">
            <div className="size-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{displayName}</p>
            </div>
            <ChevronDown className="size-4 text-muted-foreground hidden md:block" />
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
