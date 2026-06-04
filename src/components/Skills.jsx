import React, { useEffect, useRef } from 'react'
import { usePortfolioData } from '../context/PortfolioDataContext'
import styles from './Skills.module.css'

function SkillBar({ name, level }) {
  const fillRef = useRef(null)

  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => { el.style.width = level + '%' }, 200)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [level])

  return (
    <div className={styles.barItem}>
      <div className={styles.barLabel}>
        <span>{name}</span><span>{level}%</span>
      </div>
      <div className={styles.barTrack}>
        <div ref={fillRef} className={styles.barFill} style={{ width: 0 }} />
      </div>
    </div>
  )
}

export default function Skills() {
  const { data } = usePortfolioData()
  const { skillCategories } = data
  return (
    <section id="skills" className={`section ${styles.skills}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">02. Expertise</span>
          <h2 className="section-title">Technical <span className="gradient-text">Skills</span></h2>
        </div>
        <div className={styles.grid}>
          {skillCategories.map((cat, i) => (
            <div
              key={cat.title}
              className={`${styles.card} reveal`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={styles.icon}>{cat.icon}</div>
              <h3 className={styles.cardTitle}>{cat.title}</h3>
              <div className={styles.bars}>
                {cat.skills.map((s) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
