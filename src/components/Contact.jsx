import React, { useState } from 'react'
import { usePortfolioData } from '../context/PortfolioDataContext'
import styles from './Contact.module.css'

export default function Contact() {
  const { data } = usePortfolioData()
  const { personalInfo } = data
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setForm({ name: '', email: '', message: '' })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    }, 1400)
  }

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">06. Let's Talk</span>
          <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
        </div>

        <div className={styles.grid}>
          {/* Info */}
          <div className={`${styles.info} reveal`}>
            <p className={styles.intro}>
              I'm actively looking for opportunities to collaborate on innovative AI and cloud projects.
              Whether you have a project in mind, want to discuss ideas, or just want to say hi — feel free to reach out!
            </p>
            <div className={styles.items}>
              <a href={`mailto:${personalInfo.contact.email}`} className={styles.item} id="contact-email">
                <div className={styles.itemIcon}>✉️</div>
                <div className={styles.itemText}>
                  <span className={styles.itemLabel}>Email</span>
                  <span className={styles.itemValue}>{personalInfo.contact.email}</span>
                </div>
              </a>
              <a href={personalInfo.contact.linkedinUrl} target="_blank" rel="noreferrer" className={styles.item} id="contact-linkedin">
                <div className={styles.itemIcon}>💼</div>
                <div className={styles.itemText}>
                  <span className={styles.itemLabel}>LinkedIn</span>
                  <span className={styles.itemValue}>{personalInfo.contact.linkedin}</span>
                </div>
              </a>
              <a href={personalInfo.contact.githubUrl} target="_blank" rel="noreferrer" className={styles.item} id="contact-github">
                <div className={styles.itemIcon}>💻</div>
                <div className={styles.itemText}>
                  <span className={styles.itemLabel}>GitHub</span>
                  <span className={styles.itemValue}>{personalInfo.contact.github}</span>
                </div>
              </a>
            </div>
          </div>

          {/* Form */}
          <form className={`${styles.form} reveal`} onSubmit={handleSubmit} noValidate id="contact-form">
            <div className={styles.formGroup}>
              <label htmlFor="contact-name" className={styles.label}>Name</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                className={styles.input}
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact-email-input" className={styles.label}>Email</label>
              <input
                type="email"
                id="contact-email-input"
                name="email"
                className={styles.input}
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="contact-message" className={styles.label}>Message</label>
              <textarea
                id="contact-message"
                name="message"
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>
            <button
              type="submit"
              className={`btn-primary btn-full ${styles.submitBtn}`}
              disabled={sending}
              id="contact-submit-btn"
              style={{ opacity: sending ? 0.7 : 1 }}
            >
              {sending ? 'Sending...' : 'Send Message ✦'}
            </button>
            {success && (
              <div className={styles.success}>
                ✅ Message sent! I'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
