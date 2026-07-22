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
      <Route 
        path="/math" 
        element={
          <NichePage 
            seoTitle="Cramly — AI Cheatsheet Generator for Mathematics & Formulas"
            seoDescription="Generate concise, accurate math cheatsheets for Calculus, Algebra, Geometry, Statistics, and core formulas instantly."
            heroTitle="Master Mathematics —"
            heroSubtitle="Formulas, Theorems & Step-by-Step Rules."
            heroDescription="Generate concise, structured formula and concept cheat sheets for Calculus, Algebra, Geometry, and Statistics."
          />
        } 
      />
      <Route 
        path="/history" 
        element={
          <NichePage 
            seoTitle="Cramly — AI Cheatsheet Generator for History & Social Studies"
            seoDescription="Generate accurate history cheatsheets for World Wars, Empires, Civilizations, and key historical events."
            heroTitle="Master History —"
            heroSubtitle="Timelines, Wars & Civilizations."
            heroDescription="Generate structured cheat sheets for historical events, empires, wars, and key historical timelines."
          />
        } 
      />
      <Route 
        path="/geography" 
        element={
          <NichePage 
            seoTitle="Cramly — AI Cheatsheet Generator for Geography & Earth Sciences"
            seoDescription="Generate concise geography cheatsheets for Physical Geography, Climatology, Map Reading, and Urban Geography."
            heroTitle="Master Geography —"
            heroSubtitle="Landforms, Climate & Spatial Science."
            heroDescription="Generate concise cheat sheets for physical landforms, climate zones, cartography, and human geography."
          />
        } 
      />
    </Routes>
  )
}
