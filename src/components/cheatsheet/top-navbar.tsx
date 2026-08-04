'use client'

import { useAuth } from './auth-context'

// Single-line comment describing purpose per AGENTS.md rule
// Renders the clean minimal TopNavbar matching the reference UI
export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <header className="relative z-30 w-full bg-white/80 backdrop-blur-sm border-b border-slate-100/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-2xl tracking-tight text-slate-900 font-sans">
            Cramly
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
              <button
                onClick={logout}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
