import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AIChatbot from './components/AIChatbot'
import ParticleCanvas from './components/ParticleCanvas'
import AdminPanel from './components/admin/AdminPanel'
import { ChatbotProvider } from './context/ChatbotContext'
import { PortfolioDataProvider } from './context/PortfolioDataContext'

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const handler = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()
  const isAdmin = hash === '#admin'

  // Scroll reveal observer (only for portfolio view)
  useEffect(() => {
    if (isAdmin) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    const revealEls = document.querySelectorAll('.reveal')
    revealEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  })

  return (
    <PortfolioDataProvider>
      <ChatbotProvider>
        {isAdmin ? (
          <AdminPanel />
        ) : (
          <div className="app">
            <ParticleCanvas />
            <Navbar />
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Education />
              <Certifications />
              <Contact />
            </main>
            <Footer />
            <AIChatbot />
          </div>
        )}
      </ChatbotProvider>
    </PortfolioDataProvider>
  )
}
