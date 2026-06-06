import React from 'react'
import { useData } from '../../context/DataContext'
import styles from './Education.module.css'

export default function Education() {
  const { data } = useData()
  const { education } = data

  return (
    <section id="education" className={`section ${styles.education}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">04. Education</span>
          <h2 className="section-title">My <span className="gradient-text">Journey</span></h2>
          <div className="divider" />
        </div>

        <div className={styles.timeline}>
          {education?.map((e, i) => (
            <div key={i} className={`${styles.item} reveal`}>
              <div className={styles.line}>
                <div className={styles.dot} />
                {i < education.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.period}>{e.period}</span>
                  <span className={`${styles.status} ${e.status === 'current' ? styles.current : styles.done}`}>
                    {e.statusLabel}
                  </span>
                </div>
                <h3 className={styles.title}>{e.title}</h3>
                <p className={styles.inst}>{e.institution}</p>
                <p className={styles.desc}>{e.desc}</p>
                <div className={styles.tags}>
                  {e.tags?.map((t, j) => (
                    <span key={j} className="badge">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
