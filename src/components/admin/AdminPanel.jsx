import React, { useState } from 'react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import AboutEditor from './AboutEditor'
import SkillsEditor from './SkillsEditor'
import ProjectsEditor from './ProjectsEditor'
import EducationEditor from './EducationEditor'
import CertsEditor from './CertsEditor'
import AIAdminChat from './AIAdminChat'
import styles from './AdminPanel.module.css'

const ADMIN_PASSWORD = 'admin@kv'

const TABS = [
  { id: 'ai', label: '🤖 AI Manager', icon: '🤖' },
  { id: 'about', label: '👤 About', icon: '👤' },
  { id: 'skills', label: '⚙️ Skills', icon: '⚙️' },
  { id: 'projects', label: '🚀 Projects', icon: '🚀' },
  { id: 'education', label: '🎓 Education', icon: '🎓' },
  { id: 'certifications', label: '🏆 Certifications', icon: '🏆' },
]

function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pwd === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={`${styles.loginCard} ${shake ? styles.shake : ''}`}>
        <div className={styles.loginLogo}>
          <span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span>
        </div>
        <h1 className={styles.loginTitle}>Admin Panel</h1>
        <p className={styles.loginSub}>Enter your admin password to continue</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputWrap}>
            <input
              type="password"
              placeholder="Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className={`${styles.pwdInput} ${error ? styles.inputError : ''}`}
              autoFocus
              id="admin-password-input"
            />
            {error && <span className={styles.errorMsg}>❌ Incorrect password</span>}
          </div>
          <button type="submit" className={styles.loginBtn} id="admin-login-btn">
            Unlock Panel →
          </button>
        </form>
        <p className={styles.loginHint}>Default: <code>admin@kv</code></p>
        <a href="/" className={styles.backLink}>← Back to Portfolio</a>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('kv_admin') === '1')
  const [activeTab, setActiveTab] = useState('ai')
  const { resetAll } = usePortfolioData()
  const [resetConfirm, setResetConfirm] = useState(false)

  const handleLogin = () => {
    sessionStorage.setItem('kv_admin', '1')
    setAuthed(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('kv_admin')
    setAuthed(false)
  }

  const handleReset = () => {
    if (resetConfirm) {
      resetAll()
      setResetConfirm(false)
    } else {
      setResetConfirm(true)
      setTimeout(() => setResetConfirm(false), 3000)
    }
  }

  if (!authed) return <LoginScreen onLogin={handleLogin} />

  const renderTab = () => {
    switch (activeTab) {
      case 'ai': return <AIAdminChat />
      case 'about': return <AboutEditor />
      case 'skills': return <SkillsEditor />
      case 'projects': return <ProjectsEditor />
      case 'education': return <EducationEditor />
      case 'certifications': return <CertsEditor />
      default: return null
    }
  }

  return (
    <div className={styles.admin}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <span className={styles.bracket}>&lt;</span>KV<span className={styles.bracket}>/&gt;</span>
          </div>
          <span className={styles.sidebarSub}>Admin Panel</span>
        </div>

        <nav className={styles.nav}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`admin-tab-${tab.id}`}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              <span className={styles.navLabel}>{tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.viewSiteBtn} target="_blank" rel="noreferrer">
            🌐 View Portfolio
          </a>
          <button
            className={`${styles.resetBtn} ${resetConfirm ? styles.resetConfirm : ''}`}
            onClick={handleReset}
            id="admin-reset-btn"
          >
            {resetConfirm ? '⚠️ Confirm Reset?' : '↺ Reset All Data'}
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout} id="admin-logout-btn">
            🔒 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h2 className={styles.mainTitle}>
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
          <span className={styles.savedBadge}>💾 Auto-saved to localStorage</span>
        </div>
        <div className={styles.mainContent}>
          {renderTab()}
        </div>
      </main>
    </div>
  )
}
