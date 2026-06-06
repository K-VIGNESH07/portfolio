import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.logo}>
          <span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span>
        </div>
        <p className={styles.copy}>
          © {year} K Vignesh. Built with React + Firebase.
        </p>
        <div className={styles.links}>
          <a href="https://github.com/K-VIGNESH07" target="_blank" rel="noreferrer" className={styles.link} id="footer-github">GitHub</a>
          <a href="https://linkedin.com/in/vignesh-k-ab7712324" target="_blank" rel="noreferrer" className={styles.link} id="footer-linkedin">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
