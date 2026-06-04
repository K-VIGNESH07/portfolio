import React, { useState, useEffect } from 'react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import s from './editor.module.css'

function SaveToast({ show }) {
  if (!show) return null
  return <div className={s.toast}>✅ Saved!</div>
}

const emptyEntry = () => ({
  period: '',
  status: 'done',
  statusLabel: 'Completed',
  title: '',
  institution: '',
  desc: '',
  tags: [],
})

function TagsInput({ tags, onChange }) {
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
          placeholder="Add tag, press Enter" />
        <button type="button" className={s.btnSecondary} onClick={addTag}>+ Add</button>
      </div>
    </div>
  )
}

export default function EducationEditor() {
  const { data, updateSection } = usePortfolioData()
  const [entries, setEntries] = useState(() => JSON.parse(JSON.stringify(data.education)))
  const [toast, setToast] = useState(false)

  useEffect(() => { setEntries(JSON.parse(JSON.stringify(data.education))) }, [data.education])

  const save = () => {
    updateSection('education', entries)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const update = (i, field, val) =>
    setEntries((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))

  const remove = (i) => setEntries((prev) => prev.filter((_, idx) => idx !== i))
  const add = () => setEntries((prev) => [...prev, emptyEntry()])

  const handleStatusChange = (i, val) => {
    const statusLabel = val === 'current' ? 'Current' : 'Completed'
    setEntries((prev) => prev.map((e, idx) =>
      idx === i ? { ...e, status: val, statusLabel } : e
    ))
  }

  return (
    <div>
      <SaveToast show={toast} />
      <div className={s.itemList}>
        {entries.map((edu, i) => (
          <div key={i} className={s.card}>
            <div className={s.cardHeader}>
              <span className={s.itemIndex}>Entry {i + 1}</span>
              <button className={s.btnDanger} onClick={() => remove(i)}>✕ Remove</button>
            </div>

            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>Period (e.g. 2022 – 2026)</label>
                <input className={s.input} value={edu.period} onChange={(e) => update(i, 'period', e.target.value)} placeholder="2022 – 2026" id={`admin-edu-period-${i}`} />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Status</label>
                <select className={s.select} value={edu.status} onChange={(e) => handleStatusChange(i, e.target.value)}>
                  <option value="current">Current</option>
                  <option value="done">Completed</option>
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Degree / Title</label>
                <input className={s.input} value={edu.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="B.E. Computer Science" />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Institution</label>
                <input className={s.input} value={edu.institution} onChange={(e) => update(i, 'institution', e.target.value)} placeholder="Anna University" />
              </div>
              <div className={`${s.formGroup} ${s.formGroupFull}`}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={edu.desc} onChange={(e) => update(i, 'desc', e.target.value)} placeholder="Brief description..." rows={3} />
              </div>
              <div className={`${s.formGroup} ${s.formGroupFull}`}>
                <label className={s.label}>Subject Tags</label>
                <TagsInput tags={edu.tags || []} onChange={(v) => update(i, 'tags', v)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={s.btnRow}>
        <button className={s.btnSecondary} onClick={add} id="admin-edu-add">+ Add Entry</button>
        <button className={s.btnPrimary} onClick={save} id="admin-edu-save">💾 Save Changes</button>
      </div>
    </div>
  )
}
