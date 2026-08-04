import React from 'react'
import { AlertCircle, Zap, X } from 'lucide-react'

type QuotaModalProps = {
  isOpen: boolean
  onClose: () => void
  onSignUp: () => void
  user: any
}

// Renders the restyled Quota modal matching the Cramly design system
export function QuotaModal({ isOpen, onClose, onSignUp, user }: QuotaModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-[#FF4D4D]">
            <AlertCircle className="size-7 stroke-[2]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Out of Generations!
            </h2>
            <p className="text-sm text-slate-500 max-w-[300px] mx-auto leading-relaxed">
              {user 
                ? "You have reached your free generation limit. Please upgrade your account to continue generating." 
                : "You've used your free guest generation. Create a free account to unlock 5 more!"}
            </p>
          </div>

          {!user ? (
            <div className="w-full pt-3 space-y-2.5">
              <button
                onClick={onSignUp}
                className="w-full rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold py-3 text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Zap className="size-4" />
                Sign Up for Free
              </button>
              <button 
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          ) : (
            <div className="w-full pt-3">
              <button 
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
