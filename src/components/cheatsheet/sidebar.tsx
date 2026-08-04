'use client'

import { useState } from 'react'
import {
  Home,
  FileText,
  Star,
  User,
  Sparkles,
  Sun,
  Moon,
  Wand2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

// Renders the collapsible light-themed sidebar matching Homepage visual system with expand/collapse toggle button
export function Sidebar({
  active,
  onNavigate,
  dark,
  onToggleTheme,
  onAuthClick,
  user,
  onLogout,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-slate-200 bg-white p-5 lg:flex transition-all duration-300',
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      {/* Top Header: Cramly wordmark + Collapse Toggle Button */}
      <div className="flex items-center justify-between mb-6 px-1">
        {!collapsed && (
          <span className="font-bold text-2xl tracking-tight text-slate-900 font-sans">
            Cramly
          </span>
        )}
        {collapsed && (
          <span className="font-bold text-xl tracking-tight text-slate-900 font-sans mx-auto">
            C
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-auto"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5">
        {NAV.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors',
                collapsed ? 'justify-center px-0' : 'px-4',
                isActive
                  ? 'bg-red-50 text-[#FF4D4D] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <item.icon className={cn('size-4 stroke-[2] shrink-0', isActive ? 'text-[#FF4D4D]' : 'text-slate-500')} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Auth / Account Box */}
      {!user ? (
        !collapsed ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-red-50">
              <Sparkles className="size-5 text-[#FF4D4D]" />
            </div>
            <h3 className="mt-3 text-base leading-snug font-bold text-slate-900">
              Save &amp; Organize
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed font-normal text-slate-600">
              Access your cheatsheets anywhere.
            </p>
            <button
              onClick={onAuthClick}
              className="mt-4 w-full rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold py-2.5 text-sm shadow-sm transition-all"
            >
              Sign Up / Log In
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            title="Sign Up / Log In"
            className="mt-8 mx-auto flex size-10 items-center justify-center rounded-xl bg-[#FF4D4D] text-white shadow-sm"
          >
            <Sparkles className="size-5" />
          </button>
        )
      ) : (
        !collapsed ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <div className="mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ACCOUNT
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 shrink-0 rounded-full bg-red-50 flex items-center justify-center text-[#FF4D4D] font-bold text-sm">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                <p className={cn("truncate text-xs font-medium mt-0.5", user.freeCheatsheetsRemaining === 0 ? "text-rose-500 font-bold" : "text-slate-600")}>
                  {user.freeCheatsheetsRemaining} Credits Left
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
            >
              <LogOut className="size-3.5" />
              Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            title="Log Out"
            className="mt-8 mx-auto flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
          >
            <LogOut className="size-4" />
          </button>
        )
      )}

    </aside>
  )
}
