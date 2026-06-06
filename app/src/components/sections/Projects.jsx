import React from 'react'
import { useData } from '../../context/DataContext'
import styles from './Projects.module.css'

export default function Projects({ limit }) {
  const { data } = useData()
  const { projects } = data

  const displayedProjects = limit ? projects?.slice(0, limit) : projects

  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">03. Projects</span>
          <h2 className="section-title">What I've <span className="gradient-text">Built</span></h2>
          <div className="divider" />
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {displayedProjects?.map((p, i) => (
            <div key={i} className={`card ${styles.card} reveal`}>
              {/* Project thumbnail — only shown if uploaded */}
              {p.imageUrl && (
                <div className={styles.thumb}>
                  <img src={p.imageUrl} alt={p.title} className={styles.thumbImg} />
                </div>
              )}
              <div className={styles.cardTop}>
                <span className={styles.icon}>{p.icon}</span>
                <div className={styles.links}>
                  {p.github && p.github !== '#' && (
                    <a href={p.github} target="_blank" rel="noreferrer" className={styles.link} id={`project-github-${i}`}>
                      ⌥ Code
                    </a>
                  )}
                  {p.demo && p.demo !== '#' && (
                    <a href={p.demo} target="_blank" rel="noreferrer" className={styles.link} id={`project-demo-${i}`}>
                      ↗ Live
                    </a>
                  )}
                </div>
              </div>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.desc}>{p.desc}</p>
              <div className={styles.tech}>
                {p.tech?.map((t, j) => (
                  <span key={j} className="tech-pill">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {limit && projects && projects.length > limit && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }} className="reveal">
            <a href="#projects" className="btn-primary" id="view-all-projects-btn">
              View All Projects →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
