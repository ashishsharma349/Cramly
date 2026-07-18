import { Routes, Route } from 'react-router-dom'
import App from './App'
import { NichePage } from './components/cheatsheet/niche-page'

export function MainRouter() {
  return (
    <Routes>
      <Route path="/*" element={<App />} />
      <Route 
        path="/programming" 
        element={
          <NichePage 
            seoTitle="Cramly — AI Cheatsheet Generator for Programming & Tech"
            seoDescription="Generate instant, well-structured programming cheatsheets for React, Python, Databases, System Design, and more. Ace your tech interviews with Cramly."
            heroTitle="Master Programming —"
            heroSubtitle="Code Better. Revise Faster."
            heroDescription="Generate concise, well-structured syntax and concept cheat sheets for any programming language or tech stack. Save time and ace your coding interviews."
          />
        } 
      />
      <Route 
        path="/science" 
        element={
          <NichePage 
            seoTitle="Cramly — AI Cheatsheet Generator for Science & Medical Students"
            seoDescription="Generate accurate, concise cheatsheets for Biology, Chemistry, Physics, and Medical concepts instantly. Your perfect study companion."
            heroTitle="Master Science —"
            heroSubtitle="Study Smarter. Score Higher."
            heroDescription="Generate concise, well-structured cheat sheets for complex science and medical topics. From Anatomy to Quantum Physics, we've got you covered."
          />
        } 
      />
    </Routes>
  )
}
