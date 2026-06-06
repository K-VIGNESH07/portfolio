import React, { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import styles from './Hero.module.css'
import env from '../../config/env'

function useTypewriter(words, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!words || words.length === 0) return
    const word = words[wordIdx % words.length]
    const delay = deleting ? speed / 2 : speed

    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, charIdx + 1))
        if (charIdx + 1 === word.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIdx((c) => c + 1)
        }
      } else {
        setDisplay(word.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx((w) => (w + 1) % words.length)
          setCharIdx(0)
        } else {
          setCharIdx((c) => c - 1)
        }
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

// Decorative floating tech orbs around the photo
const ORBS = [
  { label: '☁️ Cloud',    angle: 320, dist: 130 },
  { label: '🤖 AI',       angle: 45,  dist: 130 },
  { label: '⚡ Backend',  angle: 200, dist: 120 },
  { label: '🐍 Python',   angle: 130, dist: 130 },
]

export default function Hero() {
  const { data } = useData()
  const { personalInfo } = data
  const typed = useTypewriter(personalInfo.typewriterWords)

  const resumeHref = personalInfo.resumeUrl || env.resumeUrl

  return (
    <section id="hero" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        {/* ── Left: Content ─────────────────────────────── */}
        <div className={styles.content}>
          {personalInfo.available && (
            <div className={styles.availBadge} id="hero-available-badge">
              <span className={styles.availDot} />
              Available for Opportunities
            </div>
          )}

          <h1 className={styles.headline}>
            <span className={styles.hi}>Hi, I'm</span>
            <br />
            <span className="gradient-text">{personalInfo.name}</span>
          </h1>

          <div className={styles.typewriter}>
            <span className={styles.typewriterLabel}>Building </span>
            <span className={styles.typewriterText}>{typed}</span>
            <span className={styles.cursor}>|</span>
          </div>

          <p className={styles.subhead}>{personalInfo.headline}</p>

          <div className={styles.floatingBadges}>
            {personalInfo.floatingBadges?.map((b, i) => (
              <span key={i} className={styles.fBadge} style={{ animationDelay: `${i * 0.3}s` }}>
                {b}
              </span>
            ))}
          </div>

          <div className={styles.stats}>
            {personalInfo.stats?.map((s, i) => (
              <div key={i} className={styles.stat}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.ctas}>
            <a href="#projects" className="btn-primary" id="hero-cta-projects">
              View Projects →
            </a>
            <a href="#contact" className="btn-outline" id="hero-cta-contact">
              Contact Me
            </a>
            {resumeHref && resumeHref !== '/resume.pdf' && (
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
                id="hero-cta-resume"
                style={{ borderColor: 'var(--border)' }}
              >
                ↓ Resume
              </a>
            )}
          </div>
        </div>

        {/* ── Right: Profile Photo Frame ─────────────────── */}
        <div className={styles.photoSection}>
          {/* Background glow blobs */}
          <div className={styles.glow1} />
          <div className={styles.glow2} />

          {/* Spinning dashed ring */}
          <div className={styles.orbitRing} />

          {/* Floating tech orbs */}
          {ORBS.map((orb, i) => {
            const rad = (orb.angle * Math.PI) / 180
            const x = Math.cos(rad) * orb.dist
            const y = Math.sin(rad) * orb.dist
            return (
              <div
                key={i}
                className={styles.orb}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  animationDelay: `${i * 0.6}s`,
                }}
              >
                {orb.label}
              </div>
            )
          })}

          {/* Photo frame */}
          <div className={styles.photoFrame}>
            <div className={styles.photoRingOuter} />
            <div className={styles.photoRingInner} />

            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.name}
                className={styles.photo}
              />
            ) : (
              /* Placeholder when no photo uploaded */
              <div className={styles.photoPlaceholder}>
                <span className={styles.placeholderInitials}>
                  {personalInfo.initials || 'KV'}
                </span>
                <span className={styles.placeholderHint}>Upload photo in Admin</span>
              </div>
            )}

            {/* Bottom name tag */}
            <div className={styles.nameTag}>
              <span className={styles.nameTagName}>{personalInfo.name}</span>
              <span className={styles.nameTagRole}>{personalInfo.headline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <div className={styles.scrollDot} />
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}
