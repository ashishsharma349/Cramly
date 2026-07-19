import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Heart, Info } from 'lucide-react'
import { TopNavbar } from './top-navbar'
import { HomeHero } from './home-hero'
import { FeatureCards } from './feature-cards'
import { Footer } from './footer'

export function NichePage({
  seoTitle,
  seoDescription,
  heroTitle,
  heroSubtitle,
  heroDescription
}: {
  seoTitle: string
  seoDescription: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
}) {
  const navigate = useNavigate()

  const handleAction = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
      </Helmet>

      {/* Top Navbar */}
      <TopNavbar onMenuClick={handleAction} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:pl-3 lg:pr-6 py-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero Section */}
          <HomeHero 
            onCreateClick={handleAction}
            title={heroTitle}
            subtitle={heroSubtitle}
            description={heroDescription}
          />

          {/* Story Behind Cramly Section */}
          <section className="relative rounded-2xl border border-border bg-card overflow-hidden">
            <div className="grid gap-12 lg:grid-cols-[1fr_300px] items-center p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="size-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Why I Built Cramly</h2>
                </div>
                <div className="prose dark:prose-invert max-w-2xl text-muted-foreground space-y-4 leading-relaxed">
                  <p className="text-base">
                    Cramly is a solo passion project built to solve one problem: turning scattered notes into concise, structured revision material you can actually rely on. Your feedback directly shapes its future.
                  </p>
                  <p className="text-base font-medium text-foreground">
                    Thank you for giving Cramly a try. I hope it saves you time and makes learning a little less stressful.
                  </p>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/30 p-4">
                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Info className="size-3 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-foreground font-medium">Note:</strong> Cramly strives for accuracy, but occasional mistakes are possible. If you spot something off, please report it — every report helps improve future results.
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:flex items-center justify-center mt-4">
                <img
                  src="/Stud-img.png"
                  alt="Student illustration"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </section>

          {/* Feature Cards */}
          <FeatureCards />
        </div>
      </main>

      <Footer onNavigate={handleAction} />
    </div>
  )
}
