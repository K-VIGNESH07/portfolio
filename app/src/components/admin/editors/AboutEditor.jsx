import React, { useState } from 'react'
import { useData } from '../../../context/DataContext'
import ImageUploader from './ImageUploader'
import s from './editor.module.css'

export default function AboutEditor() {
  const { data, updateSection } = useData()
  const [info, setInfo] = useState(() => JSON.parse(JSON.stringify(data.personalInfo)))
  const [saved, setSaved] = useState(false)

  const set = (path, val) => {
    setInfo((prev) => {
      const next = { ...prev }
      if (path.includes('.')) {
        const [a, b] = path.split('.')
        next[a] = { ...prev[a], [b]: val }
      } else {
        next[path] = val
      }
      return next
    })
  }

  const handleSave = async () => {
    await updateSection('personalInfo', info)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={s.section}>
      <h3 style={{ color: '#f0f0f8', fontWeight: 700 }}>Personal Info</h3>

      {/* ── Profile Photo ─────────────────────────────────── */}
      <div className={s.row}>
        <label className={s.label}>Profile Photo</label>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <ImageUploader
            storagePath="profile/photo.jpg"
            currentUrl={info.photoUrl || ''}
            onUploaded={(url) => set('photoUrl', url)}
            accept="image/*"
            shape="circle"
            label=""
            maxMB={5}
          />
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: '0.82rem', color: '#9090b0', lineHeight: 1.7, margin: 0 }}>
              Upload your profile photo. It will appear in the <strong style={{ color: '#f0f0f8' }}>Hero</strong> and <strong style={{ color: '#f0f0f8' }}>About</strong> sections.<br />
              If no photo is uploaded, your initials are shown instead.<br />
              <span style={{ color: '#55556a' }}>Recommended: square image, min 400×400px.</span>
            </p>
            {info.photoUrl && (
              <p style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: 8, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
                ✓ Photo uploaded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Resume PDF ────────────────────────────────────── */}
      <div className={s.row}>
        <label className={s.label}>Resume / CV (PDF)</label>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 120 }}>
            <ImageUploader
              storagePath="profile/resume.pdf"
              currentUrl={info.resumeUrl || ''}
              onUploaded={(url) => set('resumeUrl', url)}
              accept=".pdf"
              shape="rect"
              label=""
              maxMB={10}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: '0.82rem', color: '#9090b0', lineHeight: 1.7, margin: 0 }}>
              Upload your resume PDF. The <strong style={{ color: '#f0f0f8' }}>↓ Resume</strong> button in the hero will download this file.<br />
              <span style={{ color: '#55556a' }}>Max 10 MB. PDF format only.</span>
            </p>
            {info.resumeUrl && (
              <a
                href={info.resumeUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#f5a623', marginTop: 8, display: 'inline-block' }}
              >
                📄 View uploaded resume ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Basic Fields ──────────────────────────────────── */}
      <div className={s.grid2}>
        {[['name', 'Full Name'], ['headline', 'Headline'], ['subHeadline', 'Sub-Headline'], ['initials', 'Initials (fallback avatar)']].map(([key, label]) => (
          <div key={key} className={s.row}>
            <label className={s.label}>{label}</label>
            <input className={s.input} value={info[key] || ''} onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}
      </div>

      <div className={s.row}>
        <label className={s.label}>Availability</label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={info.available} onChange={(e) => set('available', e.target.checked)}
            style={{ accentColor: '#f5a623', width: 18, height: 18 }} />
          <span style={{ color: '#9090b0', fontSize: '0.9rem' }}>Available for opportunities</span>
        </label>
      </div>

      <div className={s.row}>
        <label className={s.label}>Bio Paragraphs (one per line)</label>
        <textarea className={s.input} rows={6}
          value={info.bio?.join('\n') || ''}
          onChange={(e) => set('bio', e.target.value.split('\n'))} />
      </div>

      <div className={s.row}>
        <label className={s.label}>Skill Badges (comma-separated)</label>
        <input className={s.input} value={info.badges?.join(', ') || ''}
          onChange={(e) => set('badges', e.target.value.split(',').map((x) => x.trim()))} />
      </div>

      <div className={s.row}>
        <label className={s.label}>Floating Badges (comma-separated)</label>
        <input className={s.input} value={info.floatingBadges?.join(', ') || ''}
          onChange={(e) => set('floatingBadges', e.target.value.split(',').map((x) => x.trim()))} />
      </div>

      <div className={s.row}>
        <label className={s.label}>Typewriter Words (comma-separated)</label>
        <input className={s.input} value={info.typewriterWords?.join(', ') || ''}
          onChange={(e) => set('typewriterWords', e.target.value.split(',').map((x) => x.trim()))} />
      </div>

      <h3 style={{ color: '#f0f0f8', fontWeight: 700, marginTop: 8 }}>Contact</h3>
      <div className={s.grid2}>
        {[['email', 'Email'], ['linkedin', 'LinkedIn (display)'], ['github', 'GitHub (display)'], ['linkedinUrl', 'LinkedIn URL'], ['githubUrl', 'GitHub URL']].map(([key, label]) => (
          <div key={key} className={s.row}>
            <label className={s.label}>{label}</label>
            <input className={s.input} value={info.contact?.[key] || ''} onChange={(e) => set(`contact.${key}`, e.target.value)} />
          </div>
        ))}
      </div>

      <button className={s.saveBtn} onClick={handleSave}>💾 Save Changes</button>
      {saved && <div className={s.saved}>✅ Saved to Firestore!</div>}
    </div>
  )
}
