import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Eye, ArrowRight } from 'lucide-react'
import { TopNavbar } from './top-navbar'
import { HomeHero } from './home-hero'
import { FeatureCards } from './feature-cards'
import { WhyLoveCramly } from './why-love-cramly'
import { Footer } from './footer'
import { getPublicCheatsheets } from '../../api/client.js'

export function NichePage({
  subject = 'Technology/Programming',
  seoTitle,
  seoDescription,
  heroTitle,
  heroSubtitle,
  heroDescription
}: {
  subject?: string
  seoTitle: string
  seoDescription: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
}) {
  const navigate = useNavigate()
  const [libraryJobs, setLibraryJobs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getPublicCheatsheets(subject)
      .then((data) => {
        if (isMounted) {
          setLibraryJobs(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load public library:', err)
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [subject])

  const handleAction = (id?: string) => {
    if (id && ['programming', 'science', 'math', 'history', 'geography'].includes(id)) {
      navigate(`/${id}`)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-red-500/20 selection:text-red-600 flex flex-col overflow-x-hidden">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>

      {/* Top Navbar */}
      <TopNavbar onMenuClick={handleAction} />

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Hero Section */}
        <HomeHero 
          onCreateClick={() => handleAction()}
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDescription}
        />

        {/* Public Library Section */}
        <section className="py-12 sm:py-16 bg-slate-50/50 border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#FF4D4D] text-xs font-bold mb-2">
                  <BookOpen className="size-3.5" />
                  <span>Curated Library</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Verified {subject} Cheatsheets
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Explore community-verified revision guides generated and published on Cramly.
                </p>
              </div>

              <button
                onClick={() => handleAction()}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#FF4D4D] hover:underline"
              >
                <span>Generate your own</span>
                <ArrowRight className="size-4" />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 rounded-2xl border border-slate-200/80 bg-white p-6 animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-10 bg-slate-50 rounded" />
                  </div>
                ))}
              </div>
            ) : libraryJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {libraryJobs.map((job) => (
                  <div
                    key={job.jobId || job.slug}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-6 hover:shadow-lg hover:border-red-200 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                          {job.level || 'General'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {job.subject}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-[#FF4D4D] transition-colors line-clamp-2">
                        {job.topic}
                      </h3>
                      {job.cheatsheetJSON?.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {job.cheatsheetJSON.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Verified Guide
                      </span>
                      <button
                        onClick={() => handleAction()}
                        className="text-xs font-bold text-[#FF4D4D] hover:underline inline-flex items-center gap-1.5"
                      >
                        <Eye className="size-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center space-y-3">
                <p className="text-slate-600 font-semibold text-sm">
                  No public cheatsheets found for this category yet.
                </p>
                <button
                  onClick={() => handleAction()}
                  className="px-4 py-2 rounded-xl bg-[#FF4D4D] text-white text-xs font-bold hover:bg-[#e64040] transition-colors"
                >
                  Be the first to generate one
                </button>
              </div>
            )}
          </div>
        </section>

        {/* How It Works (3 Steps) */}
        <FeatureCards />

        {/* Why Love Cramly */}
        <section className="py-12 sm:py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <WhyLoveCramly />
          </div>
        </section>
      </main>

      <Footer onNavigate={handleAction} />
    </div>
  )
}
