import React, { useState, useEffect } from 'react'
import { getContactMessages, deleteContactMessage } from '../../services/firestoreService'
import styles from './ContactMessages.module.css'

function fmt(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return '—' }
}

export default function ContactMessages() {
  const [msgs, setMsgs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    setLoading(true); setError(null)
    try { setMsgs(await getContactMessages()) }
    catch (e) { setError('Failed to load messages. Check Firestore rules.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (deleting) return
    setDeleting(id)
    try { await deleteContactMessage(id); setMsgs((m) => m.filter((x) => x.id !== id)) }
    catch { /* ignore */ }
    finally { setDeleting(null) }
  }

  if (loading) return <div className={styles.center}><div className="spinner" /><p>Loading messages…</p></div>
  if (error)   return <div className={styles.center}><p className={styles.errText}>❌ {error}</p><button className={styles.retryBtn} onClick={load}>Retry</button></div>
  if (!msgs.length) return (
    <div className={styles.center}>
      <div className={styles.emptyIcon}>📭</div>
      <p className={styles.emptyTitle}>No messages yet</p>
      <p className={styles.emptyHint}>When visitors submit the contact form, messages appear here.</p>
      <button className={styles.retryBtn} onClick={load}>↺ Refresh</button>
    </div>
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <span className={styles.count}>{msgs.length} message{msgs.length !== 1 ? 's' : ''}</span>
        <button className={styles.refreshBtn} onClick={load}>↺ Refresh</button>
      </div>
      <div className={styles.list}>
        {msgs.map((m) => (
          <div key={m.id} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.senderRow}>
                <div className={styles.avatar}>{m.name?.[0]?.toUpperCase() || '?'}</div>
                <div>
                  <div className={styles.name}>{m.name}</div>
                  <a href={`mailto:${m.email}`} className={styles.email}>{m.email}</a>
                </div>
              </div>
              <div className={styles.meta}>
                <span className={styles.ts}>{fmt(m.createdAt)}</span>
                <button className={styles.delBtn} onClick={() => handleDelete(m.id)} disabled={deleting === m.id}>
                  {deleting === m.id ? '…' : '🗑️'}
                </button>
              </div>
            </div>
            <div className={styles.body}>{m.message}</div>
            <div className={styles.foot}>
              <a href={`mailto:${m.email}?subject=Re: Your message`} className={styles.replyBtn}>↩ Reply via Email</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
