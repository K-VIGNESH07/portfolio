import React, { useEffect } from 'react'
import { DataProvider } from './context/DataContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ParticleCanvas from './components/layout/ParticleCanvas'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Education from './components/sections/Education'
import Certifications from './components/sections/Certifications'
import Contact from './components/sections/Contact'
import AIChatbot from './components/chatbot/AIChatbot'
import AdminPanel from './components/admin/AdminPanel'
import { incrementPageView } from './services/firestoreService'

// Hash-based routing: /#admin → Admin Panel
function useHash() {
  const [hash, setHash] = React.useState(window.location.hash)
  useEffect(() => {
    const handler = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  const isAdmin = hash === '#admin'
  const isProjectsPage = hash === '#projects'
  const isCertsPage = hash === '#certifications'

  // Scroll to top on page navigation
  useEffect(() => {
    if (isProjectsPage || isCertsPage) {
      window.scrollTo(0, 0)
    }
  }, [hash, isProjectsPage, isCertsPage])

  // Smooth scroll to anchor on home page
  useEffect(() => {
    if (hash && hash !== '#admin' && hash !== '#projects' && hash !== '#certifications') {
      const element = document.getElementById(hash.substring(1))
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 50)
      }
    }
  }, [hash])

  // Scroll reveal
  useEffect(() => {
    if (isAdmin) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  })

  // Page view counter
  useEffect(() => {
    if (!isAdmin) incrementPageView()
  }, [isAdmin])

  return (
    <DataProvider>
      {isAdmin ? (
        <AdminPanel />
      ) : isProjectsPage ? (
        <div className="app">
          <ParticleCanvas />
          <Navbar />
          <main style={{ paddingTop: '80px' }}>
            <div className="container" style={{ marginTop: '40px', marginBottom: '-20px' }}>
              <a href="#" className="btn-outline">
                ← Back to Home
              </a>
            </div>
            <Projects />
          </main>
          <Footer />
          <AIChatbot />
        </div>
      ) : isCertsPage ? (
        <div className="app">
          <ParticleCanvas />
          <Navbar />
          <main style={{ paddingTop: '80px' }}>
            <div className="container" style={{ marginTop: '40px', marginBottom: '-20px' }}>
              <a href="#" className="btn-outline">
                ← Back to Home
              </a>
            </div>
            <Certifications />
          </main>
          <Footer />
          <AIChatbot />
        </div>
      ) : (
        <div className="app">
          <ParticleCanvas />
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects limit={3} />
            <Education />
            <Certifications limit={3} />
            <Contact />
          </main>
          <Footer />
          <AIChatbot />
        </div>
      )}
    </DataProvider>
  )
}
