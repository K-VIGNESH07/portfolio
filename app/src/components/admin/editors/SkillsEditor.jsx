import React, { useState } from 'react'
import { useData } from '../../../context/DataContext'
import s from './editor.module.css'

export default function SkillsEditor() {
  const { data, updateSection } = useData()
  const [cats, setCats] = useState(() => JSON.parse(JSON.stringify(data.skillCategories)))
  const [saved, setSaved] = useState(false)

  const updateCat = (ci, field, val) => {
    setCats((prev) => prev.map((c, i) => i === ci ? { ...c, [field]: val } : c))
  }
  const updateSkill = (ci, si, field, val) => {
    setCats((prev) => prev.map((c, i) => i === ci
      ? { ...c, skills: c.skills.map((sk, j) => j === si ? { ...sk, [field]: val } : sk) }
      : c))
  }
  const addSkill = (ci) => setCats((prev) => prev.map((c, i) => i === ci ? { ...c, skills: [...c.skills, { name: 'New Skill', level: 70 }] } : c))
  const delSkill = (ci, si) => setCats((prev) => prev.map((c, i) => i === ci ? { ...c, skills: c.skills.filter((_, j) => j !== si) } : c))

  const handleSave = async () => {
    await updateSection('skillCategories', cats)
    setSaved(true); setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={s.section}>
      {cats.map((cat, ci) => (
        <div key={ci} className={s.card}>
          <div className={s.grid2}>
            <div className={s.row}>
              <label className={s.label}>Category Icon</label>
              <input className={s.input} value={cat.icon} onChange={(e) => updateCat(ci, 'icon', e.target.value)} />
            </div>
            <div className={s.row}>
              <label className={s.label}>Category Title</label>
              <input className={s.input} value={cat.title} onChange={(e) => updateCat(ci, 'title', e.target.value)} />
            </div>
          </div>
          <div className={s.list}>
            {cat.skills.map((sk, si) => (
              <div key={si} className={s.listItem}>
                <div className={s.listItemHead}>
                  <span className={s.itemNum}>Skill {si + 1}</span>
                  <button className={s.delBtn} onClick={() => delSkill(ci, si)}>✕ Remove</button>
                </div>
                <div className={s.row}>
                  <label className={s.label}>Skill Name</label>
                  <input className={s.input} value={sk.name} onChange={(e) => updateSkill(ci, si, 'name', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <button className={s.addBtn} onClick={() => addSkill(ci)}>+ Add Skill</button>
        </div>
      ))}
      <button className={s.saveBtn} onClick={handleSave}>💾 Save Skills</button>
      {saved && <div className={s.saved}>✅ Saved to Firestore!</div>}
    </div>
  )
}
