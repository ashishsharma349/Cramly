import React, { useState } from 'react'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  CheckCircle2,
  ArrowLeft,
  Code2,
  CheckCircle,
  Download,
} from 'lucide-react'
import { useAuth } from './auth-context'
import { signIn, signUp } from '@/lib/auth-client'

type AuthPageProps = {
  onBack: () => void
  onSuccess: () => void
}

// Renders the restyled Auth page matching the approved Cramly design system
export function AuthPage({ onBack, onSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validation checks for password
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasUppercase = /[A-Z]/.test(password)

  const { refreshUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isLogin) {
        await signIn.email({
          email,
          password,
          fetchOptions: {
            onSuccess: async () => {
              await refreshUser()
              onSuccess()
            },
            onError: (ctx) => {
              alert(ctx.error.message || 'Authentication failed')
            }
          }
        })
      } else {
        await signUp.email({
          email,
          password,
          name,
          fetchOptions: {
            onSuccess: async () => {
              await refreshUser()
              onSuccess()
            },
            onError: (ctx) => {
              alert(ctx.error.message || 'Registration failed')
            }
          }
        })
      }
    } catch (error) {
      console.error('Auth failed', error)
      alert('Authentication failed. Check connection.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 flex flex-col justify-between p-6 lg:p-8 relative overflow-x-hidden">
      {/* Subtle notes texture overlay at page edges (11% opacity) */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-[0.11] pointer-events-none mix-blend-multiply z-0"
        style={{ backgroundImage: "url('/drowning-notes-bg.png')" }}
      />

      {/* Top Header Back Action */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto mb-6 relative z-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto grid gap-12 lg:grid-cols-2 items-center relative z-10">
        {/* Left Side: Brand Promo */}
        <div className="hidden lg:flex flex-col space-y-8 pr-12">
          <div className="flex items-center gap-3">
            <span className="font-bold text-3xl tracking-tight text-slate-900 font-sans">
              Cramly
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900 text-balance">
              Create <span className="text-[#FF4D4D]">Smarter</span>.
              <br />
              Learn <span className="text-[#FF4D4D]">Better</span>.
            </h1>
            <p className="text-base text-slate-600 max-w-md leading-relaxed">
              Join thousands of learners who create high-quality, well-structured cheatsheets in seconds.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-[#FF4D4D] shrink-0">
                <Code2 className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">AI-Powered Generation</h4>
                <p className="text-xs text-slate-500">Get accurate and concise cheatsheets instantly.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-[#FF4D4D] shrink-0">
                <CheckCircle className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Well Structured</h4>
                <p className="text-xs text-slate-500">Organized content with clear sections and formats.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-[#FF4D4D] shrink-0">
                <Download className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Export Anywhere</h4>
                <p className="text-xs text-slate-500">Download as PDF or share with anyone.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex items-center justify-center w-full">
          <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {isLogin ? 'Welcome Back' : 'Create your account'}
              </h2>
              <p className="text-sm text-slate-500">
                {isLogin
                  ? 'Sign in to access your saved cheatsheets'
                  : 'Sign up to get started with Cramly'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                    <UserIcon className="size-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]/20 focus:border-[#FF4D4D]"
                  />
                </div>
              )}

              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                  <Mail className="size-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]/20 focus:border-[#FF4D4D]"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                  <Lock className="size-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]/20 focus:border-[#FF4D4D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                    <Lock className="size-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]/20 focus:border-[#FF4D4D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              )}

              {/* Password Requirements (Signup Only) */}
              {!isLogin && password.length > 0 && (
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 border border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`size-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={hasMinLength ? 'text-slate-900 font-semibold' : 'text-slate-500'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`size-3.5 ${hasNumber ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={hasNumber ? 'text-slate-900 font-semibold' : 'text-slate-500'}>Includes a number</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`size-3.5 ${hasUppercase ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={hasUppercase ? 'text-slate-900 font-semibold' : 'text-slate-500'}>Includes an uppercase letter</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold py-3 text-sm shadow-sm transition-all mt-2"
              >
                {isLogin ? 'Log In' : 'Create Account'}
              </button>
            </form>

            {/* Form Toggle */}
            <div className="text-center pt-2 text-sm text-slate-500">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#FF4D4D] font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-[#FF4D4D] font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Legal */}
      <footer className="hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 relative z-10">
        <span>© 2026 Cramly. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-900">Terms of Service</a>
          <a href="#" className="hover:text-slate-900">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900">Contact Us</a>
        </div>
      </footer>
    </div>
  )
}
