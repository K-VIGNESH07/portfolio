import React, { useEffect, useRef } from 'react'
import { usePortfolioData } from '../context/PortfolioDataContext'
import styles from './About.module.css'

export default function About() {
  const sectionRef = useRef(null)

  const { data } = usePortfolioData()
  const { personalInfo } = data

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal') || []
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className={`section ${styles.about}`} ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">01. Who I Am</span>
          <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
        </div>

        <div className={styles.grid}>
          {/* Avatar */}
          <div className={`${styles.avatarWrap} reveal`}>
            <div className={styles.ring}>
              <div className={styles.inner}>
                <span className={styles.initials}>{personalInfo.initials}</span>
              </div>
            </div>
            <div className={styles.glow} />
            {personalInfo.floatingBadges.map((badge, i) => (
              <div key={i} className={`${styles.floatingBadge} ${styles[`fb${i + 1}`]}`}>{badge}</div>
            ))}
          </div>

          {/* Text */}
          <div className={`${styles.text} reveal`}>
            <p className={styles.para}>
              I'm <strong>K Vignesh</strong>, a Computer Science Engineering student with a passion for{' '}
              <span className="highlight-text">backend architecture</span> and{' '}
              <span className="highlight-text">AI-integrated systems</span>.
            </p>
            <p className={styles.para}>
              Instead of treating AI as a surface-level feature, I build from the ground up — focusing on{' '}
              <strong>backend engineering</strong>, <strong>deep database management</strong>,{' '}
              <strong>cloud architecture</strong>, and <strong>OS-level optimization</strong> to maximize development efficiency.
            </p>
            <p className={styles.para}>
              My goal is to bridge the gap between heavy infrastructure and intelligent automation, creating scalable
              applications where AI works effortlessly to optimize workflows and supercharge engineering efficiency.
            </p>
            <div className={styles.tags}>
              {personalInfo.badges.map((badge) => (
                <span key={badge} className="tag">{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
