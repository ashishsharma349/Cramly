/* Hallmark · macrostructure: Marquee Hero · genre: playful · theme: Hum
 * audience: students · use: drive "Generate Cheatsheet" click · tone: soft
 * pre-emit critique: P5 H4 E5 S4 R5 V5
 */

import { useState, useEffect } from 'react'
import { ArrowRight, Zap, Shield, BookOpen, GraduationCap, FlaskConical, Code, Globe, History } from 'lucide-react'
import { Button } from '../ui/button'

export function HomePageV2() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const levels = [
    { icon: GraduationCap, label: 'School', desc: 'K-12 basics' },
    { icon: FlaskConical, label: 'College', desc: 'University depth' },
    { icon: Code, label: 'Expert', desc: 'Professional' }
  ]

  const subjects = [
    { icon: FlaskConical, label: 'Science' },
    { icon: Globe, label: 'Math' },
    { icon: Code, label: 'Technology' },
    { icon: History, label: 'History' },
    { icon: Globe, label: 'Geography' }
  ]

  const features = [
    { icon: Zap, label: '60-Second Generation', desc: 'Get cheatsheets in under a minute' },
    { icon: Shield, label: 'Fact-Verified', desc: 'AI-checked with source citations' },
    { icon: BookOpen, label: 'Study-Ready Format', desc: 'Optimized for quick revision' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-240 ${scrolled ? 'bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/bear-logo.png" alt="Cramly" className="h-10 w-10" />
            <span className="text-2xl font-serif font-bold text-gray-900">Cramly</span>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">How it works</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Subjects</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</a>
          </div>
          <div className="flex gap-3">
            <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Sign in</a>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-5 py-2 text-sm">
              Start free
            </Button>
          </div>
        </div>
      </nav>

      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-900 leading-tight">
                Learn Smarter.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Revise Faster.
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                AI-powered cheatsheets that turn complex topics into clear, study-ready notes in 60 seconds.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-8 py-4 text-lg">
                  Generate cheatsheet
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-full px-8 py-4 text-lg">
                  View sample
                </Button>
              </div>
            </div>
            <div className="relative">
              <img src="/Home-hero.png" alt="Cramly hero" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.label}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Choose Your Level</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {levels.map((level, i) => (
              <div key={i} className="text-center p-8 rounded-2xl border-2 border-gray-100 hover:border-emerald-200 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <level.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{level.label}</h3>
                <p className="text-gray-600">{level.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Every Subject Covered</h2>
          <p className="text-gray-600 mb-12">From Science to History, we've got your revision covered</p>
          <div className="flex flex-wrap justify-center gap-4">
            {subjects.map((subject, i) => (
              <div key={i} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-200">
                <subject.icon className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">{subject.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">Ready to Study Smarter?</h2>
          <p className="text-emerald-100 text-xl mb-8">Generate your first cheatsheet in under 60 seconds</p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full px-10 py-4 text-lg font-medium">
            Get started free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/bear-logo.png" alt="Cramly" className="h-8 w-8" />
            <span className="text-xl font-serif font-bold">Cramly</span>
          </div>
          <span className="text-gray-400 text-sm">© 2026</span>
        </div>
      </footer>
    </div>
  )
}
