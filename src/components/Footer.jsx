import React from 'react'
import { usePortfolioData } from '../context/PortfolioDataContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { data } = usePortfolioData()
  const { personalInfo } = data
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <span className={styles.logo}>
            <span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span>
          </span>
          <p className={styles.text}>
            Designed &amp; Built by <strong>{personalInfo.name}</strong> · 2025
          </p>
          <div className={styles.socials}>
            <a href={personalInfo.contact.githubUrl} target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="GitHub">GH</a>
            <a href={personalInfo.contact.linkedinUrl} target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="LinkedIn">LI</a>
            <a href="#admin" className={styles.socialLink} style={{ opacity: 0.3, fontSize: '0.65rem' }} title="Admin Panel">⚙</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
