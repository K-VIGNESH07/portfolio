import React, { useState, useRef, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import env from '../../config/env'
import styles from './AIChatbot.module.css'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function buildDynamicContext(data) {
  const { personalInfo, skillCategories, projects, education, certifications } = data

  const bioText = personalInfo?.bio?.map(p => p.replace(/<\/?[^>]+(>|$)/g, "")).join('\n') || ''
  const badgesText = personalInfo?.badges?.join(', ') || ''

  // Extract all flat skills
  const uniqueSkills = []
  skillCategories?.forEach(cat => {
    cat.skills?.forEach(s => {
      if (s.name && !uniqueSkills.includes(s.name)) {
        uniqueSkills.push(s.name)
      }
    })
  })
  const skillsText = uniqueSkills.join(', ')

  // Format projects
  const projectsText = projects?.map(p => 
    `- Project: ${p.title}\n  Description: ${p.desc}\n  Tech Stack: ${p.tech?.join(', ')}`
  ).join('\n') || 'None'

  // Format education
  const eduText = education?.map(e => 
    `- Institution: ${e.institution}\n  Degree/Level: ${e.title}\n  Duration: ${e.period}\n  Details: ${e.desc}`
  ).join('\n') || 'None'

  // Format certifications
  const certsText = certifications?.map(c => 
    `- Certification: ${c.title}\n  Issuer: ${c.issuer}\n  Year: ${c.year}`
  ).join('\n') || 'None'

  return `
You are an AI assistant representing K Vignesh's portfolio website.
Answer questions about Vignesh naturally, confidently, and concisely based on the following retrieved database records.
Keep responses to 2-4 sentences. Be friendly, helpful, and professional.

--- RETRIEVED DATABASE RECORDS ---

PERSONAL PROFILE:
- Full Name: ${personalInfo?.name || 'K Vignesh'}
- Role/Headline: ${personalInfo?.headline || ''}
- Sub-headline: ${personalInfo?.subHeadline || ''}
- Bio: ${bioText}
- Badges: ${badgesText}
- Contact Email: ${personalInfo?.contact?.email || ''}
- LinkedIn: ${personalInfo?.contact?.linkedinUrl || ''}
- GitHub: ${personalInfo?.contact?.githubUrl || ''}

TECHNICAL SKILLS & TOOLS:
${skillsText}

PROJECTS BUILT:
${projectsText}

EDUCATION HISTORY:
${eduText}

CERTIFICATIONS EARNED:
${certsText}

--- END OF RETRIEVED RECORDS ---

Use ONLY the facts in the retrieved records. If the answer cannot be found in the retrieved records, politely state that you do not have that specific information.
`
}

async function askGemini(userMsg, context, apiKey) {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${context}\n\nUser: ${userMsg}\nAssistant:` }]
      }],
      generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
    }),
  })
  if (!res.ok) throw new Error('API error')
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
}

const SUGGESTIONS = [
  'What are your top skills?',
  'Tell me about your projects',
  'Are you open to work?',
  'What technologies do you use?',
]

export default function AIChatbot() {
  const { data } = useData()
  const [open, setOpen]       = useState(false)
  const [msgs, setMsgs]       = useState([
    { role: 'ai', text: "Hi! I'm Vignesh's AI assistant. Ask me anything about his skills, projects, or experience! 👋" }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMsgs((m) => [...m, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const dynamicContext = buildDynamicContext(data)
      const reply = await askGemini(msg, dynamicContext, env.geminiApiKey)
      setMsgs((m) => [...m, { role: 'ai', text: reply }])
    } catch (err) {
      console.error('RAG Error:', err)
      setMsgs((m) => [...m, { role: 'ai', text: 'Sorry, I had trouble connecting. Please try again!' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  if (!env.hasGemini) return null

  return (
    <>
      {/* Toggle button */}
      <button
        className={`${styles.toggle} ${open ? styles.toggleOpen : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle AI Chat"
        id="chatbot-toggle"
      >
        {open ? '✕' : '🤖'}
        {!open && <span className={styles.toggleLabel}>Ask AI</span>}
      </button>

      {/* Chat window */}
      {open && (
        <div className={styles.window} id="chatbot-window">
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.headerAvatar}>🤖</div>
              <div>
                <div className={styles.headerName}>KV Assistant</div>
                <div className={styles.headerStatus}>
                  <span className={styles.onlineDot} />
                  Powered by Gemini AI
                </div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className={styles.messages}>
            {msgs.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
                {m.role === 'ai' && <span className={styles.msgAvatar}>🤖</span>}
                <div className={styles.msgBubble}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.msg} ${styles.aiMsg}`}>
                <span className={styles.msgAvatar}>🤖</span>
                <div className={styles.msgBubble}>
                  <span className={styles.typing}><span/><span/><span/></span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {msgs.length <= 1 && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className={styles.suggestion} onClick={() => send(s)} id={`chatbot-suggest-${i}`}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className={styles.inputRow}>
            <textarea
              className={styles.input}
              placeholder="Ask me anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              id="chatbot-input"
            />
            <button
              className={styles.sendBtn}
              onClick={() => send()}
              disabled={!input.trim() || loading}
              id="chatbot-send"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}
