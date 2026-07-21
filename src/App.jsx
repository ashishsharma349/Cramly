import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Home,
  FileText,
  Star,
  User as UserIcon,
  Play,
  Moon,
  Sun,
  X,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sidebar } from './components/cheatsheet/sidebar'
import { MobileHeader } from './components/cheatsheet/mobile-header'
import { BottomNav } from './components/cheatsheet/bottom-nav'
import { Hero } from './components/cheatsheet/hero'
import { GeneratorForm } from './components/cheatsheet/generator-form'
import { RecentCheatsheets } from './components/cheatsheet/recent-cheatsheets'
import { PreviewModal } from './components/cheatsheet/preview-modal'
import { StatusPoller } from './components/cheatsheet/status-poller'
import { Button } from './components/ui/button'
import { HomePage } from './components/cheatsheet/home-page'
import { HomePageV2 } from './components/cheatsheet/home-page-v2'
import { Wand2, LogOut } from 'lucide-react'
import { AuthPage } from './components/cheatsheet/auth-page'
import { useAuth } from './components/cheatsheet/auth-context'
import { QuotaModal } from './components/cheatsheet/quota-modal'
import { AboutPage } from './components/cheatsheet/about-page'
import { ContactPage } from './components/cheatsheet/contact-page'
import { TosPage } from './components/cheatsheet/tos-page'
import {
  generateCheatsheet,
  getJobStatus,
  getRecentJobs,
  deleteJob,
} from './api/client.js'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'generate', label: 'Generate', icon: Wand2 },
  { id: 'cheatsheets', label: 'My Cheatsheets', icon: FileText },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'profile', label: 'Profile', icon: UserIcon },
]

// Orchestrates the main App container, theme settings, API actions, and tab routing.
export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [theme, setTheme] = useState('light')
  const [showAuth, setShowAuth] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [previewJob, setPreviewJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)
  const queryClient = useQueryClient()
  const { user, isLoading, logout, refreshUser } = useAuth()
  const { data: jobs = [], refetch: refetchJobs } = useQuery({
    queryKey: ['recentJobs'],
    queryFn: getRecentJobs,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!user,
  })
  const [guestJobs, setGuestJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('cramly_guest_jobs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [activeJob, setActiveJob] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [toast, setToast] = useState(null)
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false)
  const pollTimerRef = useRef(null)

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const triggerHowItWorks = () => {
    setIsHowItWorksOpen(true)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const handleOpenPreview = async (job) => {
    if (job.cheatsheetJSON) {
      setPreviewJob(job)
      setIsModalOpen(true)
    } else {
      try {
        const jobId = job.jobId || job._id
        const fullJob = await getJobStatus(jobId)
        setPreviewJob(fullJob)
        setIsModalOpen(true)
      } catch (err) {
        showToast('Failed to load cheatsheet preview.', 'error')
      }
    }
  }

  const startPolling = (jobId) => {
    setIsGenerating(true)
    if (pollTimerRef.current) clearInterval(pollTimerRef.current)

    pollTimerRef.current = setInterval(async () => {
      try {
        const statusData = await getJobStatus(jobId)
        setActiveJob(statusData)

        if (statusData.status === 'done') {
          clearInterval(pollTimerRef.current)
          setActiveJob(null)
          setIsGenerating(false)
          if (!user) {
            setGuestJobs((prev) => {
              const exist = prev.some((j) => j.jobId === statusData.jobId)
              if (exist) return prev
              const newJob = {
                jobId: statusData.jobId,
                status: 'done',
                topic: statusData.cheatsheetJSON?.topic || activeJob?.topic || 'Untitled',
                subject: statusData.cheatsheetJSON?.subject || activeJob?.subject || 'General',
                level: statusData.cheatsheetJSON?.level || activeJob?.level || 'School',
                createdAt: new Date().toISOString()
              }
              const updated = [newJob, ...prev].slice(0, 5)
              localStorage.setItem('cramly_guest_jobs', JSON.stringify(updated))
              return updated
            })
          }
          refetchJobs()
          refreshUser()
          showToast('PDF generated successfully!')
          handleOpenPreview(statusData)
        } else if (statusData.status === 'error') {
          clearInterval(pollTimerRef.current)
          setActiveJob(null)
          setIsGenerating(false)
          refetchJobs()
          refreshUser()
          showToast(`Generation error: ${statusData.errorMessage || 'Unknown error occurred.'}`, 'error')
        }
      } catch (err) {
        console.error(err)
      }
    }, 2000)
  }

  const handleGenerateSubmit = async (formData) => {
    try {
      setIsGenerating(true)
      setActiveJob({ topic: formData.topic, level: formData.level, subject: formData.subject, attempts: 0, status: 'pending' })
      const response = await generateCheatsheet(formData)
      startPolling(response.jobId)
    } catch (err) {
      setActiveJob(null)
      setIsGenerating(false)
      if (err.code === 'QUOTA_EXCEEDED' || err.code === 'GUEST_LIMIT_REACHED') {
        setIsQuotaModalOpen(true)
      } else {
        alert(`Failed to start generation: ${err.message}`)
      }
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this cheatsheet?')) {
      return
    }

    if (!user) {
      setGuestJobs((prev) => {
        const updated = prev.filter((j) => j.jobId !== jobId)
        localStorage.setItem('cramly_guest_jobs', JSON.stringify(updated))
        return updated
      })
      showToast('Cheatsheet removed from local history.')
      return
    }

    try {
      await deleteJob(jobId)
      queryClient.invalidateQueries({ queryKey: ['recentJobs'] })
    } catch (err) {
      alert(`Failed to delete cheatsheet: ${err.message}`)
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [])

  if (showAuth) {
    return (
      <AuthPage
        onBack={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false)
          refreshUser()
        }}
      />
    )
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>
  }

  const displayJobs = user ? jobs : guestJobs
  const isGuest = !user

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        active={activeTab}
        onNavigate={(id) => setActiveTab(id)}
        dark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        onAuthClick={() => setShowAuth(true)}
        user={user}
        onLogout={logout}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {activeTab === 'home' ? (
          <HomePage
            jobs={displayJobs.slice(0, 3)}
            isGuest={isGuest}
            onPreview={handleOpenPreview}
            onDelete={handleDeleteJob}
            onViewAllClick={() => setActiveTab('cheatsheets')}
            onCreateClick={() => setActiveTab('generate')}
            onNavigate={(id) => setActiveTab(id)}
            onMenuClick={() => setMobileDrawerOpen(true)}
          />
        ) : activeTab === 'home-2' ? (
          <HomePageV2 />
        ) : activeTab === 'about' ? (
          <AboutPage onBack={() => setActiveTab('home')} />
        ) : activeTab === 'contact' ? (
          <ContactPage onBack={() => setActiveTab('home')} />
        ) : activeTab === 'tos' ? (
          <TosPage onBack={() => setActiveTab('home')} />
        ) : (
          <>
            <MobileHeader onMenu={() => setMobileDrawerOpen(true)} />

            <div className="hidden items-center justify-end gap-3 px-8 pt-6 lg:flex">
              <button
                type="button"
                onClick={triggerHowItWorks}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Play className="size-4 text-primary fill-current" />
                How it works
              </button>
              <div className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground font-bold text-sm">
                {user ? user.name.charAt(0).toUpperCase() : 'G'}
              </div>
            </div>

            <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {activeTab === 'generate' && (
                <>
                  <Hero />
                  <StatusPoller currentJob={activeJob} />
                  <GeneratorForm onSubmit={handleGenerateSubmit} isGenerating={isGenerating} />
                  <RecentCheatsheets
                    jobs={displayJobs.slice(0, 3)}
                    isGuest={isGuest}
                    onPreview={handleOpenPreview}
                    onDelete={handleDeleteJob}
                    onViewAllClick={() => setActiveTab('cheatsheets')}
                  />
                </>
              )}

          {activeTab === 'cheatsheets' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">
                  My Cheatsheets
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage and access your generated cheatsheets.
                </p>
              </div>
              <RecentCheatsheets
                jobs={displayJobs}
                isGuest={isGuest}
                onPreview={handleOpenPreview}
                onDelete={handleDeleteJob}
              />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center">
              <div className="text-primary flex justify-center mb-4 bg-primary/10 p-4 rounded-full">
                <Star className="size-10" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No Favorites Yet
              </h3>
              <p className="text-sm max-w-sm">
                Star your favorite cheatsheets from the preview modal to access them instantly here.
              </p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">
                User Profile
              </h2>
              <div className="bg-card p-6 rounded-3xl border border-border flex items-center gap-5">
                <div className="size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  {user ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">{user ? user.name : 'Guest User'}</h4>
                  <p className="text-sm text-muted-foreground">{user ? user.email : 'guest@cheatsheetgenerator.com'}</p>
                </div>
              </div>

              <div className="bg-card p-6 rounded-3xl border border-border space-y-3">
                <h4 className="font-bold text-foreground">Usage Statistics</h4>
                <p className="text-sm text-muted-foreground">
                  Free Cheatsheets Remaining: <strong className={user && user.freeCheatsheetsRemaining === 0 ? "text-rose-500 font-bold" : "text-foreground font-bold"}>
                    {user ? user.freeCheatsheetsRemaining : '1 (Guest Limit)'}
                  </strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Status:{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Active
                  </span>
                </p>
                {user && (
                  <button onClick={logout} className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary transition-colors">
                    <LogOut className="size-4" />
                    Log Out
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        <BottomNav active={activeTab} onNavigate={(id) => setActiveTab(id)} />
      </>
    )}
  </div>

      {mobileDrawerOpen && (
        <MobileDrawer
          active={activeTab}
          onNavigate={(id) => {
            setActiveTab(id)
            setMobileDrawerOpen(false)
          }}
          onClose={() => setMobileDrawerOpen(false)}
          dark={theme === 'dark'}
          onToggleTheme={toggleTheme}
          onAuthClick={() => {
            setShowAuth(true)
            setMobileDrawerOpen(false)
          }}
          user={user}
          onLogout={logout}
        />
      )}

      <PreviewModal
        isOpen={isModalOpen}
        job={previewJob}
        onClose={() => setIsModalOpen(false)}
      />

      {isHowItWorksOpen && (
        <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} />
      )}

      <QuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        onSignUp={() => {
          setIsQuotaModalOpen(false)
          setShowAuth(true)
        }}
        user={user}
      />

      {toast && (
        <div className="toast-notification" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 500,
          zIndex: 1000
        }}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

// Renders the responsive side drawer for mobile-view navigation.
function MobileDrawer({
  active,
  onNavigate,
  onClose,
  dark,
  onToggleTheme,
  onAuthClick,
  user,
  onLogout
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute top-0 left-0 flex h-full w-72 flex-col bg-sidebar p-6 shadow-xl border-r border-sidebar-border">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-foreground">CheatSheet</span>{' '}
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

        {!user ? (
          <Button className="mt-6 w-full rounded-xl" onClick={onAuthClick}>Sign Up / Log In</Button>
        ) : (
          <div className="mt-6">
            <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3 border border-border">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">Quota: <strong className={user.freeCheatsheetsRemaining === 0 ? "text-rose-500" : ""}>{user.freeCheatsheetsRemaining} left</strong></p>
              </div>
            </div>
            <button onClick={onLogout} className="w-full mt-2 rounded-xl py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border flex items-center justify-center gap-2">
              <LogOut className="size-4" />
              Log Out
            </button>
          </div>
        )}

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

// Renders the step-by-step how-it-works instruction guide in a custom modal.
function HowItWorksModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md flex flex-col rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">How it works</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              1
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Type your topic</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enter any programming language, tool, or domain topic you want to learn.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              2
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Select category & level</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose a subject category and set the target depth level (School, College, or Expert).
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              3
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Generate cheatsheet</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click generate. Our background worker queries Gemini to compile optimal code snippets and concepts.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              4
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Preview or download PDF</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Open the interactive preview modal to copy code snippets, or download the print-ready PDF instantly.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
