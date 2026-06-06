import React, { useState, useEffect } from 'react'
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth'
import { useData } from '../../context/DataContext'
import AboutEditor from './editors/AboutEditor'
import SkillsEditor from './editors/SkillsEditor'
import ProjectsEditor from './editors/ProjectsEditor'
import EducationEditor from './editors/EducationEditor'
import CertsEditor from './editors/CertsEditor'
import ContactMessages from './ContactMessages'
import AIAdminChat from './AIAdminChat'
import styles from './AdminPanel.module.css'

const TABS = [
  { id: 'ai',       label: '🤖 AI Manager',    icon: '🤖' },
  { id: 'about',    label: '👤 About',         icon: '👤' },
  { id: 'skills',   label: '⚙️ Skills',        icon: '⚙️' },
  { id: 'projects', label: '🚀 Projects',      icon: '🚀' },
  { id: 'education',label: '🎓 Education',     icon: '🎓' },
  { id: 'certs',    label: '🏆 Certifications',icon: '🏆' },
  { id: 'messages', label: '📬 Messages',      icon: '📬' },
]

function SyncBadge({ status }) {
  const map = {
    saving: { text: '⏳ Saving…',        cls: styles.syncSaving },
    saved:  { text: '✅ Saved',          cls: styles.syncSaved  },
    error:  { text: '❌ Sync Error',      cls: styles.syncError  },
    idle:   { text: '☁️ Firebase Sync', cls: styles.syncIdle   },
  }
  const { text, cls } = map[status] || map.idle
  return <span className={`${styles.badge} ${cls}`}>{text}</span>
}

function LoginScreen() {
  const { signIn, error, setError } = useFirebaseAuth()
  const [email, setEmail]     = useState('')
  const [pwd, setPwd]         = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const ok = await signIn(email, pwd)
    setLoading(false)
    if (!ok) { setShake(true); setTimeout(() => setShake(false), 500) }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={`${styles.loginCard} ${shake ? styles.shake : ''}`}>
        <div className={styles.logo}><span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span></div>
        <h1 className={styles.loginTitle}>Admin Panel</h1>
        <p className={styles.loginSub}>Sign in with your Firebase account</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.field}>
            <input type="email" placeholder="Email address" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              className={`${styles.inp} ${error ? styles.inpError : ''}`}
              autoFocus required id="admin-email" />
          </div>
          <div className={styles.field}>
            <input type="password" placeholder="Password" value={pwd}
              onChange={(e) => { setPwd(e.target.value); setError(null) }}
              className={`${styles.inp} ${error ? styles.inpError : ''}`}
              required id="admin-password" />
            {error && <span className={styles.errMsg}>❌ {error}</span>}
          </div>
          <button type="submit" className={styles.loginBtn} disabled={loading} id="admin-login-btn">
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
        <a href="/" className={styles.backLink}>← Back to Portfolio</a>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const { user, loading: authLoading, signOut } = useFirebaseAuth()
  const { syncStatus, resetAll } = useData()
  const [activeTab, setActiveTab]   = useState('ai')
  const [resetConfirm, setResetConfirm] = useState(false)

  if (authLoading) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginCard} style={{ textAlign: 'center' }}>
          <div className={styles.logo}><span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span></div>
          <p style={{ color: 'var(--admin-sub)', marginTop: 16 }}>Checking authentication…</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginScreen />

  const handleReset = () => {
    if (resetConfirm) { resetAll(); setResetConfirm(false) }
    else { setResetConfirm(true); setTimeout(() => setResetConfirm(false), 3000) }
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'ai':       return <AIAdminChat />
      case 'about':    return <AboutEditor />
      case 'skills':   return <SkillsEditor />
      case 'projects': return <ProjectsEditor />
      case 'education':return <EducationEditor />
      case 'certs':    return <CertsEditor />
      case 'messages': return <ContactMessages />
      default:         return null
    }
  }

  return (
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHead}>
          <div className={styles.logo}><span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span></div>
          <span className={styles.sidebarSub}>Admin Panel</span>
          {user.email && (
            <span className={styles.userEmail} title={user.email}>👤 {user.email.split('@')[0]}</span>
          )}
        </div>

        <nav className={styles.nav}>
          {TABS.map((t) => (
            <button key={t.id}
              className={`${styles.navItem} ${activeTab === t.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(t.id)} id={`admin-tab-${t.id}`}>
              <span className={styles.navIcon}>{t.icon}</span>
              <span className={styles.navLabel}>{t.id === 'certs' ? 'Certifications' : t.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFoot}>
          <a href="/" className={styles.viewBtn} target="_blank" rel="noreferrer">🌐 View Site</a>
          <button className={`${styles.resetBtn} ${resetConfirm ? styles.resetConfirmBtn : ''}`}
            onClick={handleReset} id="admin-reset-btn">
            {resetConfirm ? '⚠️ Confirm?' : '↺ Reset Data'}
          </button>
          <button className={styles.logoutBtn} onClick={signOut} id="admin-logout-btn">🔒 Logout</button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainHead}>
          <h2 className={styles.mainTitle}>{TABS.find((t) => t.id === activeTab)?.label}</h2>
          <SyncBadge status={syncStatus} />
        </div>
        <div className={styles.mainBody}>{renderTab()}</div>
      </main>
    </div>
  )
}
