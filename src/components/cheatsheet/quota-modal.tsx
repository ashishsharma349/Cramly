import React from 'react'
import { AlertCircle, Zap, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type QuotaModalProps = {
  isOpen: boolean
  onClose: () => void
  onSignUp: () => void
  user: any
}

export function QuotaModal({ isOpen, onClose, onSignUp, user }: QuotaModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="size-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Out of Generations!
            </h2>
            <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
              {user 
                ? "You have reached your free generation limit. Please upgrade to continue." 
                : "You've used your free guest generation. Create a free account to unlock 5 more!"}
            </p>
          </div>

          {!user && (
            <div className="w-full pt-4 space-y-3">
              <Button onClick={onSignUp} className="w-full rounded-xl py-6 font-bold text-base flex items-center gap-2">
                <Zap className="size-5" />
                Sign Up for Free
              </Button>
              <button 
                onClick={onClose}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          )}
          {user && (
            <div className="w-full pt-4 space-y-3">
               <button 
                onClick={onClose}
                className="w-full rounded-xl bg-secondary py-3 text-sm font-medium text-foreground transition-colors"
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
