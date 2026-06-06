import React, { useState } from 'react'
import { useData } from '../../../context/DataContext'
import ImageUploader from './ImageUploader'
import { slugify } from '../../../services/storageService'
import s from './editor.module.css'

const EMPTY_PROJECT = { icon: '🚀', title: '', desc: '', tech: [], github: '#', demo: '#', imageUrl: '' }

export default function ProjectsEditor() {
  const { data, updateSection } = useData()
  const [projects, setProjects] = useState(() => JSON.parse(JSON.stringify(data.projects)))
  const [saved, setSaved] = useState(false)

  const update = (i, field, val) =>
    setProjects((prev) => prev.map((p, j) => j === i ? { ...p, [field]: val } : p))

  const addProject = () => setProjects((prev) => [...prev, { ...EMPTY_PROJECT }])
  const delProject = (i) => setProjects((prev) => prev.filter((_, j) => j !== i))

  const handleSave = async () => {
    await updateSection('projects', projects)
    setSaved(true); setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={s.section}>
      <div className={s.list}>
        {projects.map((p, i) => (
          <div key={i} className={s.listItem}>
            <div className={s.listItemHead}>
              <span className={s.itemNum}>Project {i + 1}</span>
              <button className={s.delBtn} onClick={() => delProject(i)}>✕ Remove</button>
            </div>

            {/* ── Project Image Upload ────────────────────── */}
            <div className={s.row}>
              <ImageUploader
                storagePath={`projects/${slugify(p.title || `project-${i}`)}.jpg`}
                currentUrl={p.imageUrl || ''}
                onUploaded={(url) => update(i, 'imageUrl', url)}
                accept="image/*"
                shape="rect"
                label="Project Thumbnail (optional)"
                maxMB={5}
              />
            </div>

            <div className={s.grid2}>
              <div className={s.row}>
                <label className={s.label}>Icon (emoji)</label>
                <input className={s.input} value={p.icon} onChange={(e) => update(i, 'icon', e.target.value)} />
              </div>
              <div className={s.row}>
                <label className={s.label}>Title</label>
                <input className={s.input} value={p.title} onChange={(e) => update(i, 'title', e.target.value)} />
              </div>
            </div>
            <div className={s.row}>
              <label className={s.label}>Description</label>
              <textarea className={s.input} rows={3} value={p.desc} onChange={(e) => update(i, 'desc', e.target.value)} />
            </div>
            <div className={s.grid2}>
              <div className={s.row}>
                <label className={s.label}>Tech Stack (comma-separated)</label>
                <input className={s.input} value={p.tech?.join(', ') || ''} onChange={(e) => update(i, 'tech', e.target.value.split(',').map((x) => x.trim()))} />
              </div>
              <div className={s.row}>
                <label className={s.label}>GitHub URL</label>
                <input className={s.input} value={p.github || ''} onChange={(e) => update(i, 'github', e.target.value)} />
              </div>
              <div className={s.row}>
                <label className={s.label}>Demo URL</label>
                <input className={s.input} value={p.demo || ''} onChange={(e) => update(i, 'demo', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className={s.addBtn} onClick={addProject}>+ Add Project</button>
      <button className={s.saveBtn} onClick={handleSave}>💾 Save Projects</button>
      {saved && <div className={s.saved}>✅ Saved to Firestore!</div>}
    </div>
  )
}
