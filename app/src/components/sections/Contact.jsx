import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import { saveContactMessage } from '../../services/firestoreService'
import styles from './Contact.module.css'

export default function Contact() {
  const { data } = useData()
  const { personalInfo } = data
  const [form, setForm]   = useState({ name: '', email: '', message: '' })
  const [sending, setSending]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState(null)

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    setError(null)
    try {
      await saveContactMessage(form)
      setForm({ name: '', email: '', message: '' })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 6000)
    } catch (err) {
      console.error(err)
      setError('Failed to send. Please email me directly.')
      setTimeout(() => setError(null), 6000)
    } finally {
      setSending(false)
    }
  }

  const contact = personalInfo.contact || {}

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">06. Contact</span>
          <h2 className="section-title">Let's <span className="gradient-text">Connect</span></h2>
          <div className="divider" />
        </div>

        <div className={styles.grid}>
          {/* Info */}
          <div className={`${styles.info} reveal`}>
            <p className={styles.intro}>
              I'm actively looking for opportunities to collaborate on innovative AI and cloud projects.
              Whether you have a project in mind, want to discuss ideas, or just want to say hi — reach out!
            </p>
            <div className={styles.items}>
              <a href={`mailto:${contact.email}`} className={styles.item} id="contact-email-link">
                <div className={styles.itemIcon}>✉️</div>
                <div>
                  <div className={styles.itemLabel}>Email</div>
                  <div className={styles.itemVal}>{contact.email}</div>
                </div>
              </a>
              <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className={styles.item} id="contact-linkedin-link">
                <div className={styles.itemIcon}>💼</div>
                <div>
                  <div className={styles.itemLabel}>LinkedIn</div>
                  <div className={styles.itemVal}>{contact.linkedin}</div>
                </div>
              </a>
              <a href={contact.githubUrl} target="_blank" rel="noreferrer" className={styles.item} id="contact-github-link">
                <div className={styles.itemIcon}>💻</div>
                <div>
                  <div className={styles.itemLabel}>GitHub</div>
                  <div className={styles.itemVal}>{contact.github}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Form */}
          <form className={`${styles.form} reveal`} onSubmit={onSubmit} noValidate id="contact-form">
            <div className={styles.group}>
              <label htmlFor="contact-name" className={styles.label}>Name</label>
              <input type="text" id="contact-name" name="name" className={styles.input}
                placeholder="Your name" value={form.name} onChange={onChange} required />
            </div>
            <div className={styles.group}>
              <label htmlFor="contact-email" className={styles.label}>Email</label>
              <input type="email" id="contact-email" name="email" className={styles.input}
                placeholder="your@email.com" value={form.email} onChange={onChange} required />
            </div>
            <div className={styles.group}>
              <label htmlFor="contact-message" className={styles.label}>Message</label>
              <textarea id="contact-message" name="message" rows={5}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Tell me about your project..." value={form.message} onChange={onChange} required />
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={sending}
              id="contact-submit" style={{ opacity: sending ? 0.7 : 1 }}>
              {sending ? '⏳ Sending…' : 'Send Message ✦'}
            </button>
            {success && <div className={styles.success}>✅ Message sent! I'll get back to you soon.</div>}
            {error   && <div className={styles.errorMsg}>❌ {error}</div>}
          </form>
        </div>
      </div>
    </section>
  )
}
