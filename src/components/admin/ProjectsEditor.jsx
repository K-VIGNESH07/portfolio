import React, { useState, useEffect } from 'react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import s from './editor.module.css'

function SaveToast({ show }) {
  if (!show) return null
  return <div className={s.toast}>✅ Saved!</div>
}

const emptyProject = () => ({
  icon: '🚀',
  title: '',
  desc: '',
  tech: [],
  categories: ['backend'],
  github: '#',
  demo: '#',
})

const ALL_CATEGORIES = ['ai', 'backend', 'cloud']

function TagsInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('')
  const addTag = () => {
    const t = input.trim()
    if (t && !tags.includes(t)) onChange([...tags, t])
    setInput('')
  }
  const removeTag = (idx) => onChange(tags.filter((_, i) => i !== idx))
  return (
    <div>
      <div className={s.tagRow}>
        {tags.map((tag, i) => (
          <span key={i} className={s.tagChip}>
            {tag}
            <button className={s.tagRemove} onClick={() => removeTag(i)} type="button">✕</button>
          </span>
        ))}
      </div>
      <div className={s.tagAddRow} style={{ marginTop: 8 }}>
        <input className={s.input} value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
          placeholder={placeholder || "Add, press Enter"} />
        <button type="button" className={s.btnSecondary} onClick={addTag}>+ Add</button>
      </div>
    </div>
  )
}

export default function ProjectsEditor() {
  const { data, updateSection } = usePortfolioData()
  const [projects, setProjects] = useState(() => JSON.parse(JSON.stringify(data.projects)))
  const [toast, setToast] = useState(false)

  useEffect(() => { setProjects(JSON.parse(JSON.stringify(data.projects))) }, [data.projects])

  const save = () => {
    updateSection('projects', projects)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const update = (i, field, val) =>
    setProjects((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p))

  const toggleCategory = (i, cat) => {
    const p = projects[i]
    const cats = p.categories.includes(cat)
      ? p.categories.filter((c) => c !== cat)
      : [...p.categories, cat]
    update(i, 'categories', cats)
  }

  const remove = (i) => setProjects((prev) => prev.filter((_, idx) => idx !== i))
  const add = () => setProjects((prev) => [...prev, emptyProject()])

  return (
    <div>
      <SaveToast show={toast} />
      <div className={s.itemList}>
        {projects.map((proj, i) => (
          <div key={i} className={s.card}>
            <div className={s.cardHeader}>
              <span className={s.itemIndex}>Project {i + 1}</span>
              <button className={s.btnDanger} onClick={() => remove(i)}>✕ Remove</button>
            </div>

            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>Icon (emoji)</label>
                <input className={s.input} value={proj.icon} onChange={(e) => update(i, 'icon', e.target.value)} placeholder="🚀" />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Project Title</label>
                <input className={s.input} value={proj.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="My Awesome Project" id={`admin-proj-title-${i}`} />
              </div>
              <div className={`${s.formGroup} ${s.formGroupFull}`}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={proj.desc} onChange={(e) => update(i, 'desc', e.target.value)} placeholder="Project description..." rows={3} />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>GitHub Link</label>
                <input className={s.input} value={proj.github} onChange={(e) => update(i, 'github', e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Demo / Live Link</label>
                <input className={s.input} value={proj.demo} onChange={(e) => update(i, 'demo', e.target.value)} placeholder="https://..." />
              </div>
              <div className={`${s.formGroup} ${s.formGroupFull}`}>
                <label className={s.label}>Filter Categories</label>
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  {ALL_CATEGORIES.map((cat) => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', color: proj.categories.includes(cat) ? '#f5a623' : '#9090b0', fontSize: '0.88rem', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={proj.categories.includes(cat)}
                        onChange={() => toggleCategory(i, cat)}
                        style={{ accentColor: '#f5a623', width: 16, height: 16 }}
                      />
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div className={`${s.formGroup} ${s.formGroupFull}`}>
                <label className={s.label}>Tech Stack Tags</label>
                <TagsInput
                  tags={proj.tech}
                  onChange={(v) => update(i, 'tech', v)}
                  placeholder="Python, FastAPI..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={s.btnRow}>
        <button className={s.btnSecondary} onClick={add} id="admin-projects-add">+ Add Project</button>
        <button className={s.btnPrimary} onClick={save} id="admin-projects-save">💾 Save Changes</button>
      </div>
    </div>
  )
}
