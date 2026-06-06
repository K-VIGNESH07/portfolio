import React from 'react'
import { useData } from '../../context/DataContext'
import styles from './About.module.css'

export default function About() {
  const { data } = useData()
  const { personalInfo } = data

  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">01. About Me</span>
          <h2 className="section-title">Who Am <span className="gradient-text">I?</span></h2>
          <div className="divider" />
        </div>

        <div className={styles.grid}>
          {/* Bio */}
          <div className={`${styles.bioCol} reveal`}>
            {personalInfo.bio?.map((para, i) => (
              <p
                key={i}
                className={styles.para}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
            <div className={styles.badges}>
              {personalInfo.badges?.map((b, i) => (
                <span key={i} className="badge">{b}</span>
              ))}
            </div>
          </div>

          {/* Identity Card */}
          <div className={`${styles.cardCol} reveal`}>
            <div className={styles.identityCard}>

              {/* Avatar — photo if uploaded, else initials */}
              {personalInfo.photoUrl ? (
                <div className={styles.photoWrap}>
                  <img
                    src={personalInfo.photoUrl}
                    alt={personalInfo.name}
                    className={styles.photo}
                  />
                  <div className={styles.photoRing} />
                </div>
              ) : (
                <div className={styles.avatar}>
                  <span className={styles.avatarText}>{personalInfo.initials || 'KV'}</span>
                  <div className={styles.avatarRing} />
                </div>
              )}

              <h3 className={styles.cardName}>{personalInfo.name}</h3>
              <p className={styles.cardRole}>{personalInfo.headline}</p>
              <p className={styles.cardSub}>{personalInfo.subHeadline}</p>

              <div className={styles.statsRow}>
                {personalInfo.stats?.map((s, i) => (
                  <div key={i} className={styles.statItem}>
                    <span className={styles.statNum}>{s.num}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>

              <a href={`mailto:${personalInfo.contact?.email}`} className="btn-primary btn-full" id="about-contact-btn">
                Get In Touch →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
