import React, { useState, useEffect } from 'react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import s from './editor.module.css'

function SaveToast({ show }) {
  if (!show) return null
  return <div className={s.toast}>✅ Saved!</div>
}

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
        <input
          className={s.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
          placeholder="Add tag, press Enter"
        />
        <button type="button" className={s.btnSecondary} onClick={addTag}>+ Add</button>
      </div>
    </div>
  )
}

export default function AboutEditor() {
  const { data, updateSection } = usePortfolioData()
  const [form, setForm] = useState(() => ({ ...data.personalInfo }))
  const [toast, setToast] = useState(false)

  useEffect(() => { setForm({ ...data.personalInfo }) }, [data.personalInfo])

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }))

  const setContact = (field, value) =>
    setForm((p) => ({ ...p, contact: { ...p.contact, [field]: value } }))

  const save = () => {
    updateSection('personalInfo', form)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <div>
      <SaveToast show={toast} />

      {/* Basic Info */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Basic Information</h3>
        </div>
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.label}>Full Name</label>
            <input className={s.input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="K Vignesh" id="admin-about-name" />
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>Initials (for Avatar)</label>
            <input className={s.input} value={form.initials} onChange={(e) => set('initials', e.target.value)} placeholder="KV" maxLength={4} />
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>Headline</label>
            <input className={s.input} value={form.headline} onChange={(e) => set('headline', e.target.value)} placeholder="Backend & Cloud Architect" />
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>Sub-Headline</label>
            <input className={s.input} value={form.subHeadLine || form.subHeadline || ''} onChange={(e) => set('subHeadline', e.target.value)} placeholder="Pioneering AI-Integrated..." />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Availability Status</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <input
            type="checkbox"
            id="admin-available"
            checked={form.available !== false}
            onChange={(e) => set('available', e.target.checked)}
            style={{ width: 18, height: 18, accentColor: '#f5a623', cursor: 'pointer' }}
          />
          <label htmlFor="admin-available" style={{ color: '#f0f0f8', fontSize: '0.95rem', cursor: 'pointer' }}>
            Show "Available for Opportunities" badge
          </label>
        </div>
      </div>

      {/* Typewriter Words */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Hero Typewriter Words</h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#9090b0', marginBottom: 14 }}>
          These cycle through in the hero "I build..." animation.
        </p>
        <TagsInput
          tags={form.typewriterWords || []}
          onChange={(v) => set('typewriterWords', v)}
        />
      </div>

      {/* About badges */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>About Section Skill Badges</h3>
        </div>
        <TagsInput
          tags={form.badges || []}
          onChange={(v) => set('badges', v)}
        />
      </div>

      {/* Floating badges */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Floating Avatar Badges (max 3)</h3>
        </div>
        <div className={s.formGrid}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={s.formGroup}>
              <label className={s.label}>Badge {i + 1}</label>
              <input
                className={s.input}
                value={(form.floatingBadges || [])[i] || ''}
                onChange={(e) => {
                  const arr = [...(form.floatingBadges || ['', '', ''])]
                  arr[i] = e.target.value
                  set('floatingBadges', arr)
                }}
                placeholder="☁️ Cloud"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Contact Information</h3>
        </div>
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label className={s.label}>Email</label>
            <input className={s.input} value={form.contact?.email || ''} onChange={(e) => setContact('email', e.target.value)} placeholder="you@example.com" id="admin-contact-email" />
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>LinkedIn URL</label>
            <input className={s.input} value={form.contact?.linkedinUrl || ''} onChange={(e) => setContact('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>LinkedIn Display Text</label>
            <input className={s.input} value={form.contact?.linkedin || ''} onChange={(e) => setContact('linkedin', e.target.value)} placeholder="linkedin.com/in/you" />
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>GitHub URL</label>
            <input className={s.input} value={form.contact?.githubUrl || ''} onChange={(e) => setContact('githubUrl', e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className={s.formGroup}>
            <label className={s.label}>GitHub Display Text</label>
            <input className={s.input} value={form.contact?.github || ''} onChange={(e) => setContact('github', e.target.value)} placeholder="github.com/you" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h3 className={s.cardTitle}>Hero Stats (3 items)</h3>
        </div>
        <div className={s.formGrid}>
          {(form.stats || [{}, {}, {}]).map((stat, i) => (
            <React.Fragment key={i}>
              <div className={s.formGroup}>
                <label className={s.label}>Stat {i + 1} Number</label>
                <input
                  className={s.input}
                  value={stat.num || ''}
                  onChange={(e) => {
                    const arr = [...(form.stats || [])]
                    arr[i] = { ...arr[i], num: e.target.value }
                    set('stats', arr)
                  }}
                  placeholder="10+"
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Stat {i + 1} Label</label>
                <input
                  className={s.input}
                  value={stat.label || ''}
                  onChange={(e) => {
                    const arr = [...(form.stats || [])]
                    arr[i] = { ...arr[i], label: e.target.value }
                    set('stats', arr)
                  }}
                  placeholder="Projects"
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className={s.btnRow}>
        <button className={s.btnPrimary} onClick={save} id="admin-about-save">💾 Save Changes</button>
      </div>
    </div>
  )
}
