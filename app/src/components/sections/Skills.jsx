import React, { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import styles from './Skills.module.css'

function SkillItem({ name }) {
  return (
    <div className={styles.skillBadge}>
      <span className={styles.dot} />
      <span className={styles.skillName}>{name}</span>
    </div>
  )
}

export default function Skills() {
  const { data } = useData()
  const { skillCategories } = data

  const allSkills = useMemo(() => {
    const unique = new Map()
    skillCategories?.forEach(cat => {
      cat.skills?.forEach(s => {
        if (s.name && !unique.has(s.name.toLowerCase())) {
          unique.set(s.name.toLowerCase(), s)
        }
      })
    })
    return Array.from(unique.values())
  }, [skillCategories])

  return (
    <section id="skills" className={`section ${styles.skills}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">02. Technical Skills</span>
          <h2 className="section-title">What I <span className="gradient-text">Know & Practice</span></h2>
          <div className="divider" />
        </div>

        <div className={`card ${styles.skillsCard} reveal`}>
          <div className={styles.skillsContainer}>
            {allSkills.map((s, j) => (
              <SkillItem key={j} name={s.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
