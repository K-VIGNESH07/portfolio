import React, { useState } from 'react'
import { useData } from '../../../context/DataContext'
import s from './editor.module.css'

const EMPTY_EDU = { period: '', status: 'done', statusLabel: 'Completed', title: '', institution: '', desc: '', tags: [] }

export default function EducationEditor() {
  const { data, updateSection } = useData()
  const [edu, setEdu] = useState(() => JSON.parse(JSON.stringify(data.education)))
  const [saved, setSaved] = useState(false)

  const update = (i, field, val) => setEdu((prev) => prev.map((e, j) => j === i ? { ...e, [field]: val } : e))
  const addItem = () => setEdu((prev) => [...prev, { ...EMPTY_EDU }])
  const delItem = (i) => setEdu((prev) => prev.filter((_, j) => j !== i))

  const handleSave = async () => {
    await updateSection('education', edu)
    setSaved(true); setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={s.section}>
      <div className={s.list}>
        {edu.map((e, i) => (
          <div key={i} className={s.listItem}>
            <div className={s.listItemHead}>
              <span className={s.itemNum}>Entry {i + 1}</span>
              <button className={s.delBtn} onClick={() => delItem(i)}>✕ Remove</button>
            </div>
            <div className={s.grid2}>
              <div className={s.row}>
                <label className={s.label}>Period</label>
                <input className={s.input} value={e.period} onChange={(ev) => update(i, 'period', ev.target.value)} placeholder="2022 – 2026" />
              </div>
              <div className={s.row}>
                <label className={s.label}>Status</label>
                <select className={s.input} value={e.status} onChange={(ev) => { update(i, 'status', ev.target.value); update(i, 'statusLabel', ev.target.value === 'current' ? 'Current' : 'Completed') }}>
                  <option value="current">Current</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>
            <div className={s.row}>
              <label className={s.label}>Degree / Title</label>
              <input className={s.input} value={e.title} onChange={(ev) => update(i, 'title', ev.target.value)} />
            </div>
            <div className={s.row}>
              <label className={s.label}>Institution</label>
              <input className={s.input} value={e.institution} onChange={(ev) => update(i, 'institution', ev.target.value)} />
            </div>
            <div className={s.row}>
              <label className={s.label}>Description</label>
              <textarea className={s.input} rows={3} value={e.desc} onChange={(ev) => update(i, 'desc', ev.target.value)} />
            </div>
            <div className={s.row}>
              <label className={s.label}>Tags (comma-separated)</label>
              <input className={s.input} value={e.tags?.join(', ') || ''} onChange={(ev) => update(i, 'tags', ev.target.value.split(',').map((x) => x.trim()))} />
            </div>
          </div>
        ))}
      </div>
      <button className={s.addBtn} onClick={addItem}>+ Add Education Entry</button>
      <button className={s.saveBtn} onClick={handleSave}>💾 Save Education</button>
      {saved && <div className={s.saved}>✅ Saved to Firestore!</div>}
    </div>
  )
}
