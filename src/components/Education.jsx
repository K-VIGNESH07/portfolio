import React from 'react'
import { usePortfolioData } from '../context/PortfolioDataContext'
import styles from './Education.module.css'

export default function Education() {
  const { data } = usePortfolioData()
  const { education } = data
  return (
    <section id="education" className={`section ${styles.education}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">04. Academic Journey</span>
          <h2 className="section-title">My <span className="gradient-text">Education</span></h2>
        </div>

        <div className={styles.timeline}>
          {education.map((edu, i) => (
            <div key={i} className={`${styles.item} reveal`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className={styles.dot} />
              <div className={styles.card}>
                <div className={styles.meta}>
                  <span className={styles.year}>{edu.period}</span>
                  <span className={`${styles.status} ${edu.status === 'current' ? styles.current : styles.done}`}>
                    {edu.statusLabel}
                  </span>
                </div>
                <h3 className={styles.title}>{edu.title}</h3>
                <p className={styles.institution}>{edu.institution}</p>
                <p className={styles.desc}>{edu.desc}</p>
                <div className={styles.tags}>
                  {edu.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
