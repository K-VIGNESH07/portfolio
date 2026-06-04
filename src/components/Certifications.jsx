import React from 'react'
import { usePortfolioData } from '../context/PortfolioDataContext'
import styles from './Certifications.module.css'

export default function Certifications() {
  const { data } = usePortfolioData()
  const { certifications } = data
  return (
    <section id="certifications" className={`section ${styles.certs}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">05. Credentials</span>
          <h2 className="section-title">Certifications &amp; <span className="gradient-text">Achievements</span></h2>
        </div>
        <div className={styles.grid}>
          {certifications.map((cert, i) => (
            <div
              key={cert.title}
              className={`${styles.card} reveal`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={styles.badge}>{cert.icon}</div>
              <div className={styles.info}>
                <h3 className={styles.title}>{cert.title}</h3>
                <p className={styles.issuer}>{cert.issuer}</p>
                <span className={styles.year}>{cert.year}</span>
              </div>
              <div className={styles.verified}>✓ Verified</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
