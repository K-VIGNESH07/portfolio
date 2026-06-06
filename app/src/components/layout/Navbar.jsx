import React, { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { href: '#about',          label: 'About' },
  { href: '#skills',         label: 'Skills' },
  { href: '#projects',       label: 'Projects' },
  { href: '#education',      label: 'Education' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact',        label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} id="navbar">
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a href="#" className={styles.logo} id="navbar-logo">
          <span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span>
        </a>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.navLink} onClick={handleNavClick}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className={styles.actions}>
          <a href="#contact" className="btn-primary" id="navbar-cta" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
            Hire Me
          </a>
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="navbar-hamburger"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.mobileLink} onClick={handleNavClick}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary btn-full" onClick={handleNavClick} style={{ marginTop: '8px' }}>
            Hire Me
          </a>
        </div>
      )}
    </header>
  )
}
