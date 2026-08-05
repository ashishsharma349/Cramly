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
import { Toaster, toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Sidebar } from './components/cheatsheet/sidebar'
import { MobileHeader } from './components/cheatsheet/mobile-header'
import { BottomNav } from './components/cheatsheet/bottom-nav'
import { Hero } from './components/cheatsheet/hero'
import { GeneratorForm } from './components/cheatsheet/generator-form'
import { RecentCheatsheets } from './components/cheatsheet/recent-cheatsheets'
import { PreviewModal } from './components/cheatsheet/preview-modal'
import { LiveA4Modal } from './components/cheatsheet/live-a4-modal'
import { StatusPoller } from './components/cheatsheet/status-poller'
import { Button } from './components/ui/button'
import { HomePage } from './components/cheatsheet/home-page'
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
  subscribeJobStream,
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
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false)
  const unsubscribeStreamRef = useRef(null)
  const [liveA4Job, setLiveA4Job] = useState(null)
  const [isLiveA4ModalOpen, setIsLiveA4ModalOpen] = useState(false)

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('cramly_favorite_jobs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const handleToggleFavorite = (targetJob) => {
    if (!targetJob) return
    const id = targetJob.jobId || targetJob._id
    if (!id) return

    setFavorites((prev) => {
      const exists = prev.some((f) => (f.jobId || f._id) === id)
      let updated
      if (exists) {
        updated = prev.filter((f) => (f.jobId || f._id) !== id)
        toast.info('Removed from Favorites')
      } else {
        const itemToSave = {
          jobId: id,
          topic: targetJob.topic || targetJob.cheatsheetJSON?.title || 'Cheatsheet',
          subject: targetJob.subject || 'General',
          level: targetJob.level || 'School',
          createdAt: targetJob.createdAt || new Date().toISOString(),
          cheatsheetJSON: targetJob.cheatsheetJSON,
          fileUrl: targetJob.fileUrl || targetJob.pdfUrl
        }
        updated = [itemToSave, ...prev]
        toast.success('Added to Favorites!')
      }
      localStorage.setItem('cramly_favorite_jobs', JSON.stringify(updated))
      return updated
    })
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const triggerHowItWorks = () => {
    setIsHowItWorksOpen(true)
  }

  const handleOpenPreview = async (job) => {
    const jobId = job.jobId || job._id
    if (job.cheatsheetJSON) {
      setLiveA4Job({
        jobId,
        topic: job.topic || job.cheatsheetJSON.title,
        subject: job.subject,
        level: job.level,
        status: 'done',
        stageLabel: 'Generation Complete',
        cheatsheetJSON: job.cheatsheetJSON,
        pdfUrl: job.downloadUrl || job.fileUrl || `/uploads/${jobId}.pdf`
      })
      setIsLiveA4ModalOpen(true)
    } else if (jobId) {
      try {
        const fullJob = await getJobStatus(jobId)
        setLiveA4Job({
          jobId,
          topic: fullJob.topic || fullJob.cheatsheetJSON?.title,
          subject: fullJob.subject,
          level: fullJob.level,
          status: fullJob.status,
          stageLabel: fullJob.status === 'done' ? 'Generation Complete' : 'In Progress',
          cheatsheetJSON: fullJob.cheatsheetJSON,
          pdfUrl: fullJob.fileUrl || `/uploads/${jobId}.pdf`
        })
        setIsLiveA4ModalOpen(true)
      } catch (err) {
        toast.error('Failed to load cheatsheet preview.')
      }
    }
  }

  const startJobStream = (jobId, initialFormData) => {
    setIsGenerating(true)
    if (unsubscribeStreamRef.current) {
      unsubscribeStreamRef.current()
      unsubscribeStreamRef.current = null
    }

    const unsubscribe = subscribeJobStream(
      jobId,
      (eventData) => {
        const label = eventData.label || eventData.progressStage

        setActiveJob((prev) => ({
          ...(prev || {}),
          ...initialFormData,
          jobId,
          stageLabel: label || prev?.stageLabel || 'Processing...'
        }))

        setLiveA4Job((prev) => {
          if (!prev) return null
          const updated = { ...prev, jobId }

          if (label) {
            updated.stageLabel = label
          }

          if (eventData.outlineHeadings && eventData.outlineHeadings.length > 0) {
            if (!updated.sections || updated.sections.length === 0) {
              updated.sections = eventData.outlineHeadings.map((h, i) => ({
                index: i,
                heading: h,
                status: 'skeleton'
              }))
            }
          }

          if (eventData.stage === 'section_completed' && eventData.section) {
            const nextSections = [...(updated.sections || [])]
            const idx = typeof eventData.sectionIndex === 'number'
              ? eventData.sectionIndex
              : nextSections.findIndex((s) => s.heading === eventData.section.name)

            if (idx !== -1) {
              nextSections[idx] = {
                index: idx,
                heading: eventData.section.name || nextSections[idx]?.heading,
                status: 'done',
                description: eventData.section.description
              }
            }
            updated.sections = nextSections
          }

          if (eventData.stage === 'done') {
            updated.status = 'done'
            updated.stageLabel = 'Generation Complete!'
            if (eventData.fileUrl) {
              updated.pdfUrl = eventData.fileUrl
            }
            if (eventData.cheatsheetJSON) {
              updated.cheatsheetJSON = eventData.cheatsheetJSON
            }
          }

          return updated
        })

        if (eventData.stage === 'done') {
          if (unsubscribeStreamRef.current) unsubscribeStreamRef.current()
          setIsGenerating(false)
          setActiveJob(null)

          if (!user) {
            setGuestJobs((prev) => {
              const exist = prev.some((j) => j.jobId === jobId)
              if (exist) return prev
              const newJob = {
                jobId,
                status: 'done',
                topic: eventData.cheatsheetJSON?.title || initialFormData?.topic || 'Untitled',
                subject: initialFormData?.subject || 'General',
                level: initialFormData?.level || 'School',
                createdAt: new Date().toISOString(),
                fileUrl: eventData.fileUrl
              }
              const updated = [newJob, ...prev].slice(0, 5)
              localStorage.setItem('cramly_guest_jobs', JSON.stringify(updated))
              return updated
            })
          }
          refetchJobs()
          refreshUser()
          toast.success('Cheatsheet generated successfully!')
        } else if (eventData.stage === 'error') {
          if (unsubscribeStreamRef.current) unsubscribeStreamRef.current()
          setIsGenerating(false)
          setActiveJob(null)
          setLiveA4Job((prev) => prev ? { ...prev, status: 'error', stageLabel: 'Generation Failed', errorMessage: eventData.errorMessage } : null)
          refetchJobs()
          refreshUser()
          toast.error(`Generation error: ${eventData.errorMessage || 'Unknown error occurred.'}`)
        }
      },
      async () => {
        let attempt = 0;
        const getDelay = (a) => {
          if (a === 0) return 3000;
          if (a === 1) return 5000;
          if (a === 2) return 8000;
          return 15000;
        };

        while (attempt < 12) {
          const reconnectMsg = `Reconnecting... (Attempt ${attempt + 1} of 12)`
          setActiveJob(prev => prev ? { ...prev, stageLabel: reconnectMsg } : null)
          setLiveA4Job(prev => prev ? { ...prev, stageLabel: reconnectMsg } : null)

          try {
            const statusData = await getJobStatus(jobId)
            if (statusData.status === 'done') {
              if (unsubscribeStreamRef.current) unsubscribeStreamRef.current()
              setIsGenerating(false)
              setActiveJob(null)
              refetchJobs()
              refreshUser()
              return
            } else if (statusData.status === 'error') {
              break;
            }
          } catch (e) {
            console.error('Recovery polling attempt failed:', e)
          }
          await new Promise(resolve => setTimeout(resolve, getDelay(attempt)))
          attempt++;
        }
        
        // If recovery fails or returns non-done, we must surface the connection error
        if (unsubscribeStreamRef.current) unsubscribeStreamRef.current()
        setIsGenerating(false)
        setActiveJob(null)
        setLiveA4Job((prev) => prev ? { 
          ...prev, 
          status: 'error', 
          stageLabel: 'Connection Lost', 
          errorMessage: 'The connection to the server was lost and recovery failed.' 
        } : null)
        refetchJobs()
        refreshUser()
        toast.error('Connection lost during generation.')
      }
    )

    unsubscribeStreamRef.current = unsubscribe
  }

  const handleGenerateSubmit = async (formData) => {
    if (isGenerating) return
    try {
      setIsGenerating(true)
      const initialJob = {
        jobId: 'pending',
        topic: formData.topic,
        subject: formData.subject,
        level: formData.level,
        status: 'generating',
        stageLabel: '1. Structuring Level & Domain Curriculum...',
        sections: []
      }
      setActiveJob(initialJob)
      setLiveA4Job(initialJob)
      setIsLiveA4ModalOpen(true)

      const response = await generateCheatsheet(formData)
      startJobStream(response.jobId, formData)
    } catch (err) {
      setActiveJob(null)
      setLiveA4Job(null)
      setIsGenerating(false)
      setIsLiveA4ModalOpen(false)
      if (err.code === 'QUOTA_EXCEEDED' || err.code === 'GUEST_LIMIT_REACHED') {
        setIsQuotaModalOpen(true)
      } else {
        toast.error(`Failed to start generation: ${err.message}`)
      }
    }
  }

  const handleDeleteJob = (jobId) => {
    toast('Are you sure you want to delete this cheatsheet?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          if (!user) {
            setGuestJobs((prev) => {
              const updated = prev.filter((j) => j.jobId !== jobId)
              localStorage.setItem('cramly_guest_jobs', JSON.stringify(updated))
              return updated
            })
            toast.success('Cheatsheet removed from local history.')
            return
          }

          try {
            await deleteJob(jobId)
            queryClient.invalidateQueries({ queryKey: ['recentJobs'] })
            toast.success('Cheatsheet deleted successfully.')
          } catch (err) {
            toast.error(`Failed to delete cheatsheet: ${err.message}`)
          }
        }
      },
      cancel: {
        label: 'Cancel',
      },
    })
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    return () => {
      if (unsubscribeStreamRef.current) unsubscribeStreamRef.current()
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
    <div className="flex min-h-screen bg-[#FAFAF8] text-slate-900 relative overflow-x-hidden">
      {/* Subtle notes texture overlay at page edges (11% opacity) */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-[0.11] pointer-events-none mix-blend-multiply z-0"
        style={{ backgroundImage: "url('/drowning-notes-bg.png')" }}
      />
      {activeTab !== 'home' && (
        <Sidebar
          active={activeTab}
          onNavigate={(id) => setActiveTab(id)}
          dark={theme === 'dark'}
          onToggleTheme={toggleTheme}
          onAuthClick={() => setShowAuth(true)}
          user={user}
          onLogout={logout}
        />
      )}

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

            <div className="hidden items-center justify-end gap-3 px-8 pt-6 lg:flex relative z-10">
              <button
                type="button"
                onClick={triggerHowItWorks}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Play className="size-3.5 text-slate-800 fill-slate-800" />
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
                  <StatusPoller currentJob={activeJob} onOpenCanvas={() => setIsLiveA4ModalOpen(true)} />
                  <GeneratorForm onSubmit={handleGenerateSubmit} isGenerating={isGenerating} />
                  <RecentCheatsheets
                    jobs={displayJobs.slice(0, 3)}
                    favorites={favorites}
                    isGuest={isGuest}
                    onPreview={handleOpenPreview}
                    onDelete={handleDeleteJob}
                    onToggleFavorite={handleToggleFavorite}
                    onViewAllClick={() => setActiveTab('cheatsheets')}
                  />
                </>
              )}

          {activeTab === 'cheatsheets' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  My Cheatsheets
                </h2>
                <p className="text-sm text-slate-500">
                  Manage and access your generated cheatsheets.
                </p>
              </div>
              <RecentCheatsheets
                jobs={displayJobs}
                favorites={favorites}
                isGuest={isGuest}
                onPreview={handleOpenPreview}
                onDelete={handleDeleteJob}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Favorites
                </h2>
                <p className="text-sm text-slate-500">
                  Quick access to your starred cheatsheets.
                </p>
              </div>

              {favorites.length > 0 ? (
                <RecentCheatsheets
                  jobs={favorites}
                  favorites={favorites}
                  isGuest={isGuest}
                  onPreview={handleOpenPreview}
                  onDelete={handleDeleteJob}
                  onToggleFavorite={handleToggleFavorite}
                />
              ) : (
                <div className="rounded-2xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-sm text-center flex flex-col items-center justify-center">
                  <div className="size-14 rounded-2xl bg-red-50 text-[#FF4D4D] flex items-center justify-center mb-4">
                    <Star className="size-7 stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    No Favorites Saved Yet
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                    Star your favorite cheatsheets from the preview modal or cheatsheet list to access them instantly here.
                  </p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold px-5 py-2.5 text-sm shadow-sm transition-all flex items-center gap-2"
                  >
                    <Wand2 className="size-4" />
                    Generate a Cheatsheet
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-3xl">
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  User Profile
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your account details and view usage statistics.
                </p>
              </div>

              {/* User Details Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-red-50 text-[#FF4D4D] flex items-center justify-center text-xl font-bold shrink-0">
                    {user ? user.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{user ? user.name : 'Guest User'}</h4>
                    <p className="text-sm text-slate-500">{user ? user.email : 'guest@cheatsheetgenerator.com'}</p>
                  </div>
                </div>
                {!user ? (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold px-4 py-2 text-sm shadow-sm transition-all shrink-0"
                  >
                    Sign Up / Log In
                  </button>
                ) : (
                  <button
                    onClick={logout}
                    className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 text-sm transition-colors flex items-center gap-2 shrink-0"
                  >
                    <LogOut className="size-4" />
                    Log Out
                  </button>
                )}
              </div>

              {/* Usage Statistics Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Usage Statistics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">
                      Free Cheatsheets Remaining
                    </span>
                    <span className={cn("text-2xl font-extrabold", user && user.freeCheatsheetsRemaining === 0 ? "text-red-500" : "text-slate-900")}>
                      {user ? user.freeCheatsheetsRemaining : '1 (Guest Limit)'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">
                      Account Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full mt-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </div>
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

      <LiveA4Modal
        isOpen={isLiveA4ModalOpen}
        job={liveA4Job}
        isGenerating={isGenerating}
        onClose={() => setIsLiveA4ModalOpen(false)}
        isFavorite={Boolean(liveA4Job && favorites.some((f) => (f.jobId || f._id) === (liveA4Job.jobId || liveA4Job._id)))}
        onToggleFavorite={() => liveA4Job && handleToggleFavorite(liveA4Job)}
      />

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

      <Toaster position="bottom-right" duration={3000} closeButton richColors />
    </div>
  )
}

// Renders the responsive side drawer for mobile-view navigation.
function MobileDrawer({
  active,
  onNavigate,
  onClose,
  onAuthClick,
  user,
  onLogout
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute top-0 left-0 flex h-full w-72 flex-col bg-white p-6 shadow-xl border-r border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            Cramly
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
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
                    ? 'bg-red-50 text-[#FF4D4D] font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {!user ? (
          <button
            onClick={onAuthClick}
            className="mt-6 w-full rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold py-3 text-sm shadow-sm transition-all"
          >
            Sign Up / Log In
          </button>
        ) : (
          <div className="mt-6 space-y-2">
            <div className="px-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Account
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
              <div className="size-8 rounded-full bg-red-50 text-[#FF4D4D] flex items-center justify-center font-bold text-sm border border-red-100">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                <p className="truncate text-xs text-slate-500">
                  Quota: <strong className={user.freeCheatsheetsRemaining === 0 ? "text-red-500 font-bold" : "text-slate-700 font-bold"}>{user.freeCheatsheetsRemaining} left</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center gap-2"
            >
              <LogOut className="size-4" />
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Renders the step-by-step how-it-works instruction guide in a custom modal
function HowItWorksModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xl font-extrabold text-slate-900">How it works</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#FF4D4D] border border-red-100">
              1
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Type your topic</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Enter any programming language, tool, or domain topic you want to learn.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#FF4D4D] border border-red-100">
              2
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Select category & level</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Choose a subject category and set the target depth level (School, College, or Expert).
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#FF4D4D] border border-red-100">
              3
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Generate cheatsheet</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Click generate. Our background worker queries Gemini to compile optimal code snippets and concepts.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#FF4D4D] border border-red-100">
              4
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Preview or download PDF</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Open the interactive preview modal to copy code snippets, or download the print-ready PDF instantly.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#FF4D4D] hover:bg-[#FF3333] text-white py-3 text-sm font-semibold shadow-md shadow-red-500/20 transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
