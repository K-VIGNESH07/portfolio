import React, { useState, useEffect } from 'react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import s from './editor.module.css'

function SaveToast({ show }) {
  if (!show) return null
  return <div className={s.toast}>✅ Saved!</div>
}

const emptySkillItem = () => ({ name: '', level: 80 })
const emptyCategory = () => ({ icon: '⚙️', title: '', skills: [emptySkillItem()] })

export default function SkillsEditor() {
  const { data, updateSection } = usePortfolioData()
  const [cats, setCats] = useState(() => JSON.parse(JSON.stringify(data.skillCategories)))
  const [toast, setToast] = useState(false)

  useEffect(() => { setCats(JSON.parse(JSON.stringify(data.skillCategories))) }, [data.skillCategories])

  const save = () => {
    updateSection('skillCategories', cats)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const updateCat = (ci, field, val) => {
    setCats((prev) => prev.map((c, i) => i === ci ? { ...c, [field]: val } : c))
  }

  const updateSkill = (ci, si, field, val) => {
    setCats((prev) => prev.map((c, i) => {
      if (i !== ci) return c
      const skills = c.skills.map((sk, j) => j === si ? { ...sk, [field]: val } : sk)
      return { ...c, skills }
    }))
  }

  const addSkill = (ci) => {
    setCats((prev) => prev.map((c, i) => i === ci ? { ...c, skills: [...c.skills, emptySkillItem()] } : c))
  }

  const removeSkill = (ci, si) => {
    setCats((prev) => prev.map((c, i) => {
      if (i !== ci) return c
      return { ...c, skills: c.skills.filter((_, j) => j !== si) }
    }))
  }

  const addCategory = () => setCats((prev) => [...prev, emptyCategory()])
  const removeCategory = (ci) => setCats((prev) => prev.filter((_, i) => i !== ci))

  return (
    <div>
      <SaveToast show={toast} />
      <div className={s.itemList}>
        {cats.map((cat, ci) => (
          <div key={ci} className={s.card}>
            <div className={s.cardHeader}>
              <span className={s.itemIndex}>Category {ci + 1}</span>
              <button className={s.btnDanger} onClick={() => removeCategory(ci)} type="button">✕ Remove</button>
            </div>

            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>Icon (emoji)</label>
                <input className={s.input} value={cat.icon} onChange={(e) => updateCat(ci, 'icon', e.target.value)} placeholder="⚙️" />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Category Title</label>
                <input
                  className={s.input}
                  value={cat.title}
                  onChange={(e) => updateCat(ci, 'title', e.target.value)}
                  placeholder="Backend Development"
                  id={`admin-skill-cat-${ci}`}
                />
              </div>
            </div>

            <hr className={s.divider} />
            <p style={{ fontSize: '0.78rem', color: '#9090b0', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Skills</p>

            {cat.skills.map((sk, si) => (
              <div key={si} className={s.itemCard} style={{ marginBottom: 10 }}>
                <div className={s.formGrid}>
                  <div className={s.formGroup}>
                    <label className={s.label}>Skill Name</label>
                    <input
                      className={s.input}
                      value={sk.name}
                      onChange={(e) => updateSkill(ci, si, 'name', e.target.value)}
                      placeholder="Python"
                      id={`admin-skill-${ci}-${si}-name`}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.label}>Level (1–100) — {sk.level}%</label>
                    <input
                      type="range"
                      min="1" max="100"
                      value={sk.level}
                      onChange={(e) => updateSkill(ci, si, 'level', Number(e.target.value))}
                      style={{ accentColor: '#f5a623', width: '100%', marginTop: 8 }}
                    />
                  </div>
                </div>
                {cat.skills.length > 1 && (
                  <button className={s.btnDanger} onClick={() => removeSkill(ci, si)} type="button" style={{ marginTop: 8 }}>
                    ✕ Remove Skill
                  </button>
                )}
              </div>
            ))}

            <button className={s.btnSecondary} onClick={() => addSkill(ci)} type="button" style={{ marginTop: 8 }}>
              + Add Skill
            </button>
          </div>
        ))}
      </div>

      <div className={s.btnRow}>
        <button className={s.btnSecondary} onClick={addCategory} id="admin-skills-add-cat">+ Add Category</button>
        <button className={s.btnPrimary} onClick={save} id="admin-skills-save">💾 Save Changes</button>
      </div>
    </div>
  )
}
