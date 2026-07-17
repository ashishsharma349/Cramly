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
  Printer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from './auth-context'
import { signIn, signUp } from '@/lib/auth-client'

type AuthPageProps = {
  onBack: () => void
  onSuccess: () => void
}

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

  const handleGoogleSignIn = () => {
    // // TODO: Implement Google OAuth Integration here
    console.log('Google Sign-In clicked')
    onSuccess()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6 lg:p-8">
      {/* Top Mobile/Header Back Action */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
        {/* Left Side: Brand Promo (hidden on mobile) */}
        <div className="hidden lg:flex flex-col space-y-8 pr-12">
          <div className="flex items-center gap-3">
            <img
              src="/bear-logo.png"
              alt="Cramly logo"
              className="size-16 object-contain"
            />
            <div className="leading-tight tracking-tight">
              <span className="block text-2xl font-bold text-foreground">Cramly</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold leading-tight text-balance">
              Create <span className="text-primary">Smarter</span>.
              <br />
              Learn <span className="text-primary">Better</span>.
            </h1>
            <p className="text-base text-muted-foreground max-w-md">
              Join thousands of learners who create high-quality, well-structured cheat sheets in seconds.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Code2 className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">AI-Powered Generation</h4>
                <p className="text-xs text-muted-foreground">Get accurate and concise cheat sheets instantly.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <CheckCircle className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Well Structured</h4>
                <p className="text-xs text-muted-foreground">Organized content with clear sections and formats.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Download className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Export Anywhere</h4>
                <p className="text-xs text-muted-foreground">Download as PDF, Markdown or share with anyone.</p>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="pt-6">
            <img
              src="/hero-doc.png"
              alt="Cheatsheet illustration"
              className="h-auto w-64 object-contain opacity-90"
            />
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex items-center justify-center w-full">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lg">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {isLogin ? 'Welcome Back' : 'Create your account'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? 'Sign in to access your saved cheatsheets'
                  : 'Sign up to get started with Cramly'}
              </p>
            </div>

            {/* Google Sign-in - Temporarily Disabled
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.76 5.76 0 0 1 8.2 12.8a5.76 5.76 0 0 1 5.79-5.8 5.66 5.66 0 0 1 3.93 1.556l3.18-3.18A9.916 9.916 0 0 0 13.99 2 9.99 9.99 0 0 0 4 12a9.99 9.99 0 0 0 9.99 10c5.3 0 9.69-3.837 9.69-10a8.77 8.77 0 0 0-.22-1.715H12.24z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-6 text-center">
              <span className="absolute inset-x-0 top-1/2 border-t border-border -translate-y-1/2" />
              <span className="relative bg-card px-3 text-xs text-muted-foreground uppercase font-medium">
                or
              </span>
            </div>
            */}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <UserIcon className="size-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Mail className="size-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Lock className="size-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <Lock className="size-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              )}

              {/* Password Requirements (Signup Only) */}
              {!isLogin && password.length > 0 && (
                <div className="rounded-xl bg-secondary/30 p-3 space-y-1.5 border border-border">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`size-3.5 ${hasMinLength ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    <span className={hasMinLength ? 'text-foreground font-medium' : 'text-muted-foreground'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`size-3.5 ${hasNumber ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    <span className={hasNumber ? 'text-foreground font-medium' : 'text-muted-foreground'}>Includes a number</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`size-3.5 ${hasUppercase ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    <span className={hasUppercase ? 'text-foreground font-medium' : 'text-muted-foreground'}>Includes an uppercase letter</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full rounded-xl py-3 font-semibold mt-2">
                {isLogin ? 'Log In' : 'Create Account'}
              </Button>
            </form>

            {/* Form Toggle */}
            <div className="text-center mt-6 text-sm text-muted-foreground">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Legal (Desktop Only) */}
      <footer className="hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
        <span>© 2026 Cramly. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground">Terms of Service</a>
          <a href="#" className="hover:text-foreground">Privacy Policy</a>
          <a href="#" className="hover:text-foreground">Contact Us</a>
        </div>
      </footer>
    </div>
  )
}
