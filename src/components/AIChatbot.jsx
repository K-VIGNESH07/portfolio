import React, { useState, useRef, useEffect } from 'react'
import { useChatbot } from '../context/ChatbotContext'
import { PORTFOLIO_CONTEXT } from '../data/portfolioData'
import env from '../config/env'
import styles from './AIChatbot.module.css'

// API key is read from .env (VITE_GEMINI_API_KEY)
const GEMINI_API_KEY = env.geminiApiKey

const SUGGESTIONS = [
  { label: "Top Skills", q: "What are Vignesh's top skills?" },
  { label: "Projects", q: "Tell me about his projects" },
  { label: "Certifications", q: "What certifications does he have?" },
  { label: "Availability", q: "Is he available for internships?" },
]

// ---- Local fallback ----
const LOCAL_ANSWERS = {
  skills: "Vignesh's top skills include Python, FastAPI, AWS, GCP, Docker, Kubernetes, AI Agents with LangChain, RAG systems, and PostgreSQL. He specializes in backend engineering and cloud-native AI integration!",
  projects: "Vignesh has built 6+ featured projects including an AI Agent Orchestration Framework, Serverless Cloud Data Pipeline on AWS, RAG-Powered Knowledge Assistant, and a Zero-Trust Auth Microservice. Check the Projects section for full details!",
  certifications: "He holds certifications in AWS Cloud Practitioner, Google Cloud Associate, Deep Learning Specialization, Docker & Kubernetes Mastery, Python for Data Engineering, and LangChain & LLM Development.",
  internship: "Yes! Vignesh is actively open to internships, project collaborations, and full-time opportunities after his graduation in 2026. Reach out via the Contact section!",
  education: "Vignesh is pursuing a B.E. in Computer Science & Engineering from an Anna University affiliated college (2022–2026).",
  contact: "You can reach Vignesh via email, LinkedIn, or GitHub — all links are in the Contact section at the bottom of the page!",
  ai: "Vignesh focuses on AI agents, LangChain, LlamaIndex, RAG systems, and LLM API integration. He builds AI into the core of applications rather than as an afterthought!",
  backend: "Vignesh is a Backend & Cloud Architect skilled in Python, FastAPI, Node.js, REST/GraphQL APIs, microservices, and async programming patterns.",
  cloud: "Vignesh works with AWS and GCP, using Terraform for IaC, Docker/Kubernetes for containerization, and CI/CD pipelines.",
}

function getLocalResponse(q) {
  const query = q.toLowerCase()
  if (query.includes('skill') || query.includes('tech')) return LOCAL_ANSWERS.skills
  if (query.includes('project') || query.includes('work') || query.includes('built')) return LOCAL_ANSWERS.projects
  if (query.includes('cert')) return LOCAL_ANSWERS.certifications
  if (query.includes('intern') || query.includes('hire') || query.includes('job') || query.includes('avail')) return LOCAL_ANSWERS.internship
  if (query.includes('edu') || query.includes('college') || query.includes('degree')) return LOCAL_ANSWERS.education
  if (query.includes('contact') || query.includes('email') || query.includes('reach')) return LOCAL_ANSWERS.contact
  if (query.includes('ai') || query.includes('agent') || query.includes('rag') || query.includes('llm')) return LOCAL_ANSWERS.ai
  if (query.includes('backend') || query.includes('api') || query.includes('server')) return LOCAL_ANSWERS.backend
  if (query.includes('cloud') || query.includes('aws') || query.includes('gcp') || query.includes('docker')) return LOCAL_ANSWERS.cloud
  return "That's a great question! I'd suggest reaching out to Vignesh directly via the Contact section — he'll be happy to chat! 😊"
}

async function askGemini(userMessage) {
  if (!env.hasGeminiKey) {
    await new Promise((r) => setTimeout(r, 800))
    return getLocalResponse(userMessage)
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`
  const body = {
    contents: [{ parts: [{ text: `${PORTFOLIO_CONTEXT}\n\nVisitor question: "${userMessage}"\n\nYour response:` }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 200, topP: 0.9 },
  }
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) throw new Error(`${res.status}`)
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getLocalResponse(userMessage)
  } catch {
    return getLocalResponse(userMessage)
  }
}

// ---- Components ----
function TypingDots() {
  return (
    <div className={styles.typingBubble}>
      <span /><span /><span />
    </div>
  )
}

export default function AIChatbot() {
  const { isOpen, closeChat } = useChatbot()
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! 👋 I'm Vignesh's AI assistant. Ask me anything about his skills, projects, education, or experience!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeChat() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeChat])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setLoading(true)
    try {
      const response = await askGemini(trimmed)
      setMessages((prev) => [...prev, { role: 'bot', text: response }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Oops! Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}
        onClick={closeChat}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="AI Assistant"
        aria-hidden={!isOpen}
        id="ai-panel"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.statusDot} />
            Ask About Vignesh
          </div>
          <button className={styles.closeBtn} onClick={closeChat} aria-label="Close chat" id="ai-panel-close">✕</button>
        </div>

        {/* Messages */}
        <div className={styles.messages} id="ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgBot}`}>
              <div className={styles.avatar}>{msg.role === 'bot' ? '✦' : 'U'}</div>
              <div className={styles.bubble}>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.msg} ${styles.msgBot}`}>
              <div className={styles.avatar}>✦</div>
              <div className={styles.bubble}><TypingDots /></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              className={styles.chip}
              onClick={() => sendMessage(s.q)}
              disabled={loading}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.input}
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-label="Chat input"
            id="ai-input"
          />
          <button
            className={styles.sendBtn}
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="Send"
            id="ai-send-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <div className={styles.apiNotice}>
          {env.hasGeminiKey
            ? '✅ Gemini API connected via .env'
            : '⚙️ Add VITE_GEMINI_API_KEY to .env to enable live AI'}
        </div>
      </div>
    </>
  )
}
