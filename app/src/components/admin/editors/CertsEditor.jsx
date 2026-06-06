import React, { useState } from 'react'
import { useData } from '../../../context/DataContext'
import ImageUploader from './ImageUploader'
import { slugify } from '../../../services/storageService'
import s from './editor.module.css'

const EMPTY_CERT = { icon: '🏆', title: '', issuer: '', year: '', imageUrl: '' }

export default function CertsEditor() {
  const { data, updateSection } = useData()
  const [certs, setCerts] = useState(() => JSON.parse(JSON.stringify(data.certifications)))
  const [saved, setSaved] = useState(false)

  const update = (i, field, val) => setCerts((prev) => prev.map((c, j) => j === i ? { ...c, [field]: val } : c))
  const addCert = () => setCerts((prev) => [...prev, { ...EMPTY_CERT }])
  const delCert = (i) => setCerts((prev) => prev.filter((_, j) => j !== i))

  const handleSave = async () => {
    await updateSection('certifications', certs)
    setSaved(true); setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={s.section}>
      <div className={s.list}>
        {certs.map((c, i) => (
          <div key={i} className={s.listItem}>
            <div className={s.listItemHead}>
              <span className={s.itemNum}>Cert {i + 1}</span>
              <button className={s.delBtn} onClick={() => delCert(i)}>✕ Remove</button>
            </div>

            {/* ── Cert Image ──────────────────────────────── */}
            <div className={s.row}>
              <ImageUploader
                storagePath={`certifications/${slugify(c.title || `cert-${i}`)}.jpg`}
                currentUrl={c.imageUrl || ''}
                onUploaded={(url) => update(i, 'imageUrl', url)}
                accept="image/*"
                shape="rect"
                label="Certificate Image / Badge (optional)"
                maxMB={5}
              />
            </div>

            <div className={s.grid2}>
              <div className={s.row}>
                <label className={s.label}>Icon (emoji)</label>
                <input className={s.input} value={c.icon} onChange={(e) => update(i, 'icon', e.target.value)} />
              </div>
              <div className={s.row}>
                <label className={s.label}>Year</label>
                <input className={s.input} value={c.year} onChange={(e) => update(i, 'year', e.target.value)} placeholder="2024" />
              </div>
              <div className={s.row}>
                <label className={s.label}>Title</label>
                <input className={s.input} value={c.title} onChange={(e) => update(i, 'title', e.target.value)} />
              </div>
              <div className={s.row}>
                <label className={s.label}>Issuer</label>
                <input className={s.input} value={c.issuer} onChange={(e) => update(i, 'issuer', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className={s.addBtn} onClick={addCert}>+ Add Certification</button>
      <button className={s.saveBtn} onClick={handleSave}>💾 Save Certifications</button>
      {saved && <div className={s.saved}>✅ Saved to Firestore!</div>}
    </div>
  )
}
