import React, { useState, useEffect } from 'react'
import { useChatbot } from '../context/ChatbotContext'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#certifications', label: 'Certs' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { openChat } = useChatbot()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = document.querySelectorAll('section[id]')
      let current = ''
      sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 100) current = s.id })
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} id="navbar">
      <div className={styles.container}>
        <a href="#home" className={styles.logo} onClick={handleNavClick} id="nav-logo-link">
          <span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${styles.link} ${active === link.href.slice(1) ? styles.activeLink : ''}`}
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/resume.pdf" className={styles.cta} download id="resume-download-btn">
              Resume ↓
            </a>
          </li>
        </ul>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
          id="hamburger"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
