import React from 'react'
import { useData } from '../../context/DataContext'
import styles from './Certifications.module.css'

export default function Certifications({ limit }) {
  const { data } = useData()
  const { certifications } = data

  const displayedCerts = limit ? certifications?.slice(0, limit) : certifications

  return (
    <section id="certifications" className={`section ${styles.certs}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">05. Certifications</span>
          <h2 className="section-title">What I've <span className="gradient-text">Earned</span></h2>
          <div className="divider" />
        </div>

        <div className={styles.grid}>
          {displayedCerts?.map((c, i) => (
            <div key={i} className={`${styles.card} reveal`}>
              {/* Certificate image — shows if uploaded, emoji icon if not */}
              {c.imageUrl ? (
                <div className={styles.imgWrap}>
                  <img src={c.imageUrl} alt={c.title} className={styles.certImg} />
                </div>
              ) : (
                <span className={styles.icon}>{c.icon}</span>
              )}
              <div className={styles.info}>
                <h3 className={styles.title}>{c.title}</h3>
                <p className={styles.issuer}>{c.issuer}</p>
              </div>
              <span className={styles.year}>{c.year}</span>
            </div>
          ))}
        </div>

        {limit && certifications && certifications.length > limit && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }} className="reveal">
            <a href="#certifications" className="btn-primary" id="view-all-certs-btn">
              View All Certifications →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
