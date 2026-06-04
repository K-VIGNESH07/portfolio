import React, { useState, useEffect } from 'react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import s from './editor.module.css'

function SaveToast({ show }) {
  if (!show) return null
  return <div className={s.toast}>✅ Saved!</div>
}

const emptyEntry = () => ({
  icon: '🏆',
  title: '',
  issuer: '',
  year: new Date().getFullYear().toString(),
})

const ICON_OPTIONS = ['🏆', '🎓', '🤖', '⚙️', '🐍', '🔗', '☁️', '🔐', '🌐', '📜', '🥇', '💡']

export default function CertsEditor() {
  const { data, updateSection } = usePortfolioData()
  const [certs, setCerts] = useState(() => JSON.parse(JSON.stringify(data.certifications)))
  const [toast, setToast] = useState(false)

  useEffect(() => { setCerts(JSON.parse(JSON.stringify(data.certifications))) }, [data.certifications])

  const save = () => {
    updateSection('certifications', certs)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const update = (i, field, val) =>
    setCerts((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c))

  const remove = (i) => setCerts((prev) => prev.filter((_, idx) => idx !== i))
  const add = () => setCerts((prev) => [...prev, emptyEntry()])

  return (
    <div>
      <SaveToast show={toast} />
      <div className={s.itemList}>
        {certs.map((cert, i) => (
          <div key={i} className={s.card}>
            <div className={s.cardHeader}>
              <span className={s.itemIndex}>
                {cert.icon} Cert {i + 1}
              </span>
              <button className={s.btnDanger} onClick={() => remove(i)}>✕ Remove</button>
            </div>

            <div className={s.formGrid}>
              {/* Icon picker */}
              <div className={s.formGroup}>
                <label className={s.label}>Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {ICON_OPTIONS.map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => update(i, 'icon', ico)}
                      style={{
                        fontSize: '1.4rem',
                        padding: '5px 8px',
                        borderRadius: 8,
                        border: cert.icon === ico ? '2px solid #f5a623' : '2px solid transparent',
                        background: cert.icon === ico ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      {ico}
                    </button>
                  ))}
                  <input
                    className={s.input}
                    value={cert.icon}
                    onChange={(e) => update(i, 'icon', e.target.value)}
                    placeholder="Custom emoji"
                    style={{ width: 100 }}
                  />
                </div>
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Year</label>
                <input
                  className={s.input}
                  value={cert.year}
                  onChange={(e) => update(i, 'year', e.target.value)}
                  placeholder="2024"
                  maxLength={4}
                  id={`admin-cert-year-${i}`}
                />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Certificate Title</label>
                <input
                  className={s.input}
                  value={cert.title}
                  onChange={(e) => update(i, 'title', e.target.value)}
                  placeholder="AWS Cloud Practitioner"
                  id={`admin-cert-title-${i}`}
                />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Issuing Organization</label>
                <input
                  className={s.input}
                  value={cert.issuer}
                  onChange={(e) => update(i, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={s.btnRow}>
        <button className={s.btnSecondary} onClick={add} id="admin-certs-add">+ Add Certification</button>
        <button className={s.btnPrimary} onClick={save} id="admin-certs-save">💾 Save Changes</button>
      </div>
    </div>
  )
}
