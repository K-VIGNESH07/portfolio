import React, { useState, useRef, useEffect, useCallback } from 'react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import s from './AIAdminChat.module.css'

// ─── Gemini Function Calling Tool Definitions ───────────────────────────────
const TOOLS = [
  {
    function_declarations: [
      {
        name: 'update_personal_info',
        description: 'Update personal information such as name, headline, email, LinkedIn, GitHub, availability status, typewriter words, badges, floating badges, or hero stats.',
        parameters: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING', description: 'Full name' },
            initials: { type: 'STRING', description: 'Initials shown in avatar (2-4 chars)' },
            headline: { type: 'STRING', description: 'Professional headline' },
            subHeadline: { type: 'STRING', description: 'Sub-headline text' },
            available: { type: 'BOOLEAN', description: 'Whether the "available for opportunities" badge shows' },
            typewriterWords: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Words that cycle in hero typewriter' },
            badges: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Skill badges shown in About section' },
            floatingBadges: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Floating badges near avatar (max 3)' },
            contact_email: { type: 'STRING', description: 'Contact email address' },
            contact_linkedin: { type: 'STRING', description: 'LinkedIn display text' },
            contact_linkedinUrl: { type: 'STRING', description: 'LinkedIn full URL' },
            contact_github: { type: 'STRING', description: 'GitHub display text' },
            contact_githubUrl: { type: 'STRING', description: 'GitHub full URL' },
          },
          required: [],
        },
      },
      {
        name: 'add_skill_category',
        description: 'Add a new skill category with skills.',
        parameters: {
          type: 'OBJECT',
          properties: {
            icon: { type: 'STRING', description: 'Emoji icon for the category' },
            title: { type: 'STRING', description: 'Category title' },
            skills: {
              type: 'ARRAY',
              description: 'List of skills',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' },
                  level: { type: 'NUMBER', description: 'Skill level 1-100' },
                },
              },
            },
          },
          required: ['icon', 'title', 'skills'],
        },
      },
      {
        name: 'update_skill_category',
        description: 'Update an existing skill category by index.',
        parameters: {
          type: 'OBJECT',
          properties: {
            index: { type: 'NUMBER', description: '0-based index of the category to update' },
            icon: { type: 'STRING' },
            title: { type: 'STRING' },
            skills: {
              type: 'ARRAY',
              items: { type: 'OBJECT', properties: { name: { type: 'STRING' }, level: { type: 'NUMBER' } } },
            },
          },
          required: ['index'],
        },
      },
      {
        name: 'remove_skill_category',
        description: 'Remove a skill category by index.',
        parameters: {
          type: 'OBJECT',
          properties: { index: { type: 'NUMBER', description: '0-based index to remove' } },
          required: ['index'],
        },
      },
      {
        name: 'add_project',
        description: 'Add a new project to the portfolio.',
        parameters: {
          type: 'OBJECT',
          properties: {
            icon: { type: 'STRING', description: 'Emoji icon' },
            title: { type: 'STRING', description: 'Project title' },
            desc: { type: 'STRING', description: 'Project description' },
            tech: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Tech stack tags' },
            categories: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Filter categories: ai, backend, cloud' },
            github: { type: 'STRING', description: 'GitHub URL' },
            demo: { type: 'STRING', description: 'Demo/live URL' },
          },
          required: ['title', 'desc'],
        },
      },
      {
        name: 'update_project',
        description: 'Update an existing project by index.',
        parameters: {
          type: 'OBJECT',
          properties: {
            index: { type: 'NUMBER', description: '0-based project index' },
            icon: { type: 'STRING' },
            title: { type: 'STRING' },
            desc: { type: 'STRING' },
            tech: { type: 'ARRAY', items: { type: 'STRING' } },
            categories: { type: 'ARRAY', items: { type: 'STRING' } },
            github: { type: 'STRING' },
            demo: { type: 'STRING' },
          },
          required: ['index'],
        },
      },
      {
        name: 'remove_project',
        description: 'Remove a project by index.',
        parameters: {
          type: 'OBJECT',
          properties: { index: { type: 'NUMBER' } },
          required: ['index'],
        },
      },
      {
        name: 'add_education',
        description: 'Add a new education entry to the timeline.',
        parameters: {
          type: 'OBJECT',
          properties: {
            period: { type: 'STRING', description: 'e.g. 2022 – 2026' },
            status: { type: 'STRING', description: 'current or done' },
            statusLabel: { type: 'STRING', description: 'Current or Completed' },
            title: { type: 'STRING', description: 'Degree title' },
            institution: { type: 'STRING', description: 'College/university name' },
            desc: { type: 'STRING', description: 'Description' },
            tags: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Subject tags' },
          },
          required: ['title', 'institution'],
        },
      },
      {
        name: 'update_education',
        description: 'Update an education entry by index.',
        parameters: {
          type: 'OBJECT',
          properties: {
            index: { type: 'NUMBER' },
            period: { type: 'STRING' },
            status: { type: 'STRING' },
            statusLabel: { type: 'STRING' },
            title: { type: 'STRING' },
            institution: { type: 'STRING' },
            desc: { type: 'STRING' },
            tags: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['index'],
        },
      },
      {
        name: 'remove_education',
        description: 'Remove an education entry by index.',
        parameters: {
          type: 'OBJECT',
          properties: { index: { type: 'NUMBER' } },
          required: ['index'],
        },
      },
      {
        name: 'add_certification',
        description: 'Add a new certification.',
        parameters: {
          type: 'OBJECT',
          properties: {
            icon: { type: 'STRING', description: 'Emoji icon' },
            title: { type: 'STRING', description: 'Certification name' },
            issuer: { type: 'STRING', description: 'Issuing organization' },
            year: { type: 'STRING', description: 'Year obtained' },
          },
          required: ['title', 'issuer'],
        },
      },
      {
        name: 'update_certification',
        description: 'Update a certification by index.',
        parameters: {
          type: 'OBJECT',
          properties: {
            index: { type: 'NUMBER' },
            icon: { type: 'STRING' },
            title: { type: 'STRING' },
            issuer: { type: 'STRING' },
            year: { type: 'STRING' },
          },
          required: ['index'],
        },
      },
      {
        name: 'remove_certification',
        description: 'Remove a certification by index.',
        parameters: {
          type: 'OBJECT',
          properties: { index: { type: 'NUMBER' } },
          required: ['index'],
        },
      },
    ],
  },
]

// ─── Execute function calls against portfolio data ────────────────────────────
function executeToolCall(name, args, data, updateSection) {
  const cloneData = () => ({
    personalInfo: JSON.parse(JSON.stringify(data.personalInfo)),
    skillCategories: JSON.parse(JSON.stringify(data.skillCategories)),
    projects: JSON.parse(JSON.stringify(data.projects)),
    education: JSON.parse(JSON.stringify(data.education)),
    certifications: JSON.parse(JSON.stringify(data.certifications)),
  })

  const d = cloneData()

  switch (name) {
    case 'update_personal_info': {
      const pi = d.personalInfo
      if (args.name !== undefined) pi.name = args.name
      if (args.initials !== undefined) pi.initials = args.initials
      if (args.headline !== undefined) pi.headline = args.headline
      if (args.subHeadLine !== undefined || args.subHeadline !== undefined) pi.subHeadline = args.subHeadLine || args.subHeadline
      if (args.available !== undefined) pi.available = args.available
      if (args.typewriterWords !== undefined) pi.typewriterWords = args.typewriterWords
      if (args.badges !== undefined) pi.badges = args.badges
      if (args.floatingBadges !== undefined) pi.floatingBadges = args.floatingBadges
      if (args.contact_email !== undefined) pi.contact = { ...pi.contact, email: args.contact_email }
      if (args.contact_linkedin !== undefined) pi.contact = { ...pi.contact, linkedin: args.contact_linkedin }
      if (args.contact_linkedinUrl !== undefined) pi.contact = { ...pi.contact, linkedinUrl: args.contact_linkedinUrl }
      if (args.contact_github !== undefined) pi.contact = { ...pi.contact, github: args.contact_github }
      if (args.contact_githubUrl !== undefined) pi.contact = { ...pi.contact, githubUrl: args.contact_githubUrl }
      updateSection('personalInfo', pi)
      return `✅ Personal info updated.`
    }

    case 'add_skill_category': {
      const newCat = { icon: args.icon || '⚙️', title: args.title, skills: args.skills || [] }
      d.skillCategories.push(newCat)
      updateSection('skillCategories', d.skillCategories)
      return `✅ Added skill category "${args.title}" with ${args.skills?.length || 0} skills.`
    }

    case 'update_skill_category': {
      const ci = args.index
      if (ci < 0 || ci >= d.skillCategories.length) return `❌ No category at index ${ci}.`
      if (args.icon !== undefined) d.skillCategories[ci].icon = args.icon
      if (args.title !== undefined) d.skillCategories[ci].title = args.title
      if (args.skills !== undefined) d.skillCategories[ci].skills = args.skills
      updateSection('skillCategories', d.skillCategories)
      return `✅ Updated skill category "${d.skillCategories[ci].title}".`
    }

    case 'remove_skill_category': {
      const ci = args.index
      if (ci < 0 || ci >= d.skillCategories.length) return `❌ No category at index ${ci}.`
      const removed = d.skillCategories.splice(ci, 1)[0]
      updateSection('skillCategories', d.skillCategories)
      return `✅ Removed skill category "${removed.title}".`
    }

    case 'add_project': {
      const proj = {
        icon: args.icon || '🚀',
        title: args.title,
        desc: args.desc,
        tech: args.tech || [],
        categories: args.categories || ['backend'],
        github: args.github || '#',
        demo: args.demo || '#',
      }
      d.projects.push(proj)
      updateSection('projects', d.projects)
      return `✅ Added project "${args.title}".`
    }

    case 'update_project': {
      const pi = args.index
      if (pi < 0 || pi >= d.projects.length) return `❌ No project at index ${pi}.`
      const p = d.projects[pi]
      if (args.icon !== undefined) p.icon = args.icon
      if (args.title !== undefined) p.title = args.title
      if (args.desc !== undefined) p.desc = args.desc
      if (args.tech !== undefined) p.tech = args.tech
      if (args.categories !== undefined) p.categories = args.categories
      if (args.github !== undefined) p.github = args.github
      if (args.demo !== undefined) p.demo = args.demo
      updateSection('projects', d.projects)
      return `✅ Updated project "${p.title}".`
    }

    case 'remove_project': {
      const pi = args.index
      if (pi < 0 || pi >= d.projects.length) return `❌ No project at index ${pi}.`
      const removed = d.projects.splice(pi, 1)[0]
      updateSection('projects', d.projects)
      return `✅ Removed project "${removed.title}".`
    }

    case 'add_education': {
      const entry = {
        period: args.period || '',
        status: args.status || 'done',
        statusLabel: args.statusLabel || 'Completed',
        title: args.title,
        institution: args.institution,
        desc: args.desc || '',
        tags: args.tags || [],
      }
      d.education.unshift(entry)
      updateSection('education', d.education)
      return `✅ Added education entry "${args.title}" at ${args.institution}.`
    }

    case 'update_education': {
      const ei = args.index
      if (ei < 0 || ei >= d.education.length) return `❌ No education entry at index ${ei}.`
      const e = d.education[ei]
      if (args.period !== undefined) e.period = args.period
      if (args.status !== undefined) e.status = args.status
      if (args.statusLabel !== undefined) e.statusLabel = args.statusLabel
      if (args.title !== undefined) e.title = args.title
      if (args.institution !== undefined) e.institution = args.institution
      if (args.desc !== undefined) e.desc = args.desc
      if (args.tags !== undefined) e.tags = args.tags
      updateSection('education', d.education)
      return `✅ Updated education entry "${e.title}".`
    }

    case 'remove_education': {
      const ei = args.index
      if (ei < 0 || ei >= d.education.length) return `❌ No education entry at index ${ei}.`
      const removed = d.education.splice(ei, 1)[0]
      updateSection('education', d.education)
      return `✅ Removed education entry "${removed.title}".`
    }

    case 'add_certification': {
      const cert = {
        icon: args.icon || '🏆',
        title: args.title,
        issuer: args.issuer,
        year: args.year || String(new Date().getFullYear()),
      }
      d.certifications.push(cert)
      updateSection('certifications', d.certifications)
      return `✅ Added certification "${args.title}" by ${args.issuer}.`
    }

    case 'update_certification': {
      const ci = args.index
      if (ci < 0 || ci >= d.certifications.length) return `❌ No certification at index ${ci}.`
      const c = d.certifications[ci]
      if (args.icon !== undefined) c.icon = args.icon
      if (args.title !== undefined) c.title = args.title
      if (args.issuer !== undefined) c.issuer = args.issuer
      if (args.year !== undefined) c.year = args.year
      updateSection('certifications', d.certifications)
      return `✅ Updated certification "${c.title}".`
    }

    case 'remove_certification': {
      const ci = args.index
      if (ci < 0 || ci >= d.certifications.length) return `❌ No certification at index ${ci}.`
      const removed = d.certifications.splice(ci, 1)[0]
      updateSection('certifications', d.certifications)
      return `✅ Removed certification "${removed.title}".`
    }

    default:
      return `⚠️ Unknown tool: ${name}`
  }
}

// ─── Build system prompt with current data snapshot ─────────────────────────
function buildSystemPrompt(data) {
  return `You are an intelligent AI portfolio manager for K Vignesh's portfolio website.
You have full control to read and modify every section of the portfolio.

CURRENT PORTFOLIO DATA SNAPSHOT:
${JSON.stringify(data, null, 2)}

YOUR CAPABILITIES:
- Update personal info (name, headline, contact, badges, availability)
- Manage skill categories and individual skills with proficiency levels
- Add, update, or remove projects (with tech stack, categories, links)
- Manage education timeline entries
- Manage certifications and achievements

INSTRUCTIONS:
1. When the user asks you to make changes, call the appropriate tool function(s).
2. You can call MULTIPLE tools in a single response if needed.
3. After making changes, briefly confirm what you did and what changed.
4. If the user asks to view current data, describe it from the snapshot above.
5. Skill levels are 1-100. Categories for projects: "ai", "backend", "cloud".
6. Education status: "current" = in progress, "done" = completed.
7. Be helpful, precise, and concise. Don't ask unnecessary clarifying questions for simple tasks.
8. When adding items, use sensible defaults for missing fields.
9. Index references are 0-based (first item = index 0).`
}

// ─── Call Gemini with function calling ──────────────────────────────────────
async function callGemini(apiKey, messages, data) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const contents = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))

  const body = {
    system_instruction: { parts: [{ text: buildSystemPrompt(data) }] },
    contents,
    tools: TOOLS,
    tool_config: { function_calling_config: { mode: 'AUTO' } },
    generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }

  return res.json()
}

// ─── Main Component ──────────────────────────────────────────────────────────
const QUICK_COMMANDS = [
  'What data is in my portfolio?',
  'Add a new project',
  'Update my email',
  'Add a certification',
  'Show all my skills',
  'Add a new skill category',
]

export default function AIAdminChat() {
  const { data, updateSection } = usePortfolioData()
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('kv_gemini_key') || '')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [keySet, setKeySet] = useState(() => !!localStorage.getItem('kv_gemini_key'))

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 I'm your AI Portfolio Manager powered by Gemini! I can read and edit every section of your portfolio.\n\nTry: *\"Add a project called My New App\"* or *\"Update my email to new@email.com\"*",
      isSystem: true,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([]) // Gemini conversation history
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const saveKey = () => {
    if (!apiKeyInput.trim()) return
    localStorage.setItem('kv_gemini_key', apiKeyInput.trim())
    setApiKey(apiKeyInput.trim())
    setKeySet(true)
    setApiKeyInput('')
  }

  const clearKey = () => {
    localStorage.removeItem('kv_gemini_key')
    setApiKey('')
    setKeySet(false)
  }

  const addMsg = (role, text, toolResults = null, isError = false) => {
    setMessages((prev) => [...prev, { role, text, toolResults, isError }])
  }

  const sendMessage = useCallback(async (userText) => {
    const trimmed = userText.trim()
    if (!trimmed || loading) return

    setInput('')
    addMsg('user', trimmed)
    setLoading(true)

    const newHistory = [...history, { role: 'user', text: trimmed }]

    try {
      const response = await callGemini(apiKey, newHistory, data)
      const candidate = response.candidates?.[0]
      const parts = candidate?.content?.parts || []

      let textResponse = ''
      const toolResults = []

      for (const part of parts) {
        if (part.text) {
          textResponse += part.text
        }

        if (part.functionCall) {
          const { name, args } = part.functionCall
          const result = executeToolCall(name, args, data, updateSection)
          toolResults.push({ name, args, result })
        }
      }

      // If only tool calls were made, synthesize a response
      if (!textResponse && toolResults.length > 0) {
        textResponse = toolResults.map((r) => r.result).join('\n')
      }

      if (toolResults.length > 0) {
        addMsg('assistant', textResponse || 'Done! Changes applied.', toolResults)
      } else {
        addMsg('assistant', textResponse || '...')
      }

      setHistory([...newHistory, { role: 'assistant', text: textResponse }])
    } catch (err) {
      addMsg('assistant', `❌ Error: ${err.message}`, null, true)
    } finally {
      setLoading(false)
    }
  }, [apiKey, data, history, loading, updateSection])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      text: "Chat cleared! I'm ready to help manage your portfolio. What would you like to do?",
      isSystem: true,
    }])
    setHistory([])
  }

  // ── API Key Gate ─────────────────────────────────────────────────────────
  if (!keySet) {
    return (
      <div className={s.keyGate}>
        <div className={s.keyIcon}>🤖</div>
        <h2 className={s.keyTitle}>Connect Your Gemini API</h2>
        <p className={s.keySub}>
          This AI Manager uses <strong>Google Gemini 2.0 Flash</strong> with function calling to manage your portfolio via natural language.
        </p>
        <div className={s.keySteps}>
          <div className={s.keyStep}>
            <span className={s.keyStepNum}>1</span>
            <span>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className={s.keyLink}>aistudio.google.com/app/apikey</a></span>
          </div>
          <div className={s.keyStep}>
            <span className={s.keyStepNum}>2</span>
            <span>Click "Create API Key" — it's free</span>
          </div>
          <div className={s.keyStep}>
            <span className={s.keyStepNum}>3</span>
            <span>Paste it below</span>
          </div>
        </div>
        <div className={s.keyInputRow}>
          <input
            className={s.keyInput}
            type="password"
            placeholder="AIzaSy..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveKey()}
            autoFocus
            id="ai-manager-api-key"
          />
          <button className={s.keyBtn} onClick={saveKey} id="ai-manager-save-key">
            Connect →
          </button>
        </div>
        <p className={s.keyPrivacy}>🔒 Stored in localStorage only — never sent to any server except Google.</p>
      </div>
    )
  }

  // ── Chat UI ──────────────────────────────────────────────────────────────
  return (
    <div className={s.chat}>
      {/* Chat Header */}
      <div className={s.chatHeader}>
        <div className={s.chatHeaderLeft}>
          <div className={s.aiAvatar}>✦</div>
          <div>
            <div className={s.chatTitle}>AI Portfolio Manager</div>
            <div className={s.chatSub}>Gemini 2.0 Flash • Function Calling</div>
          </div>
        </div>
        <div className={s.chatHeaderRight}>
          <button className={s.clearBtn} onClick={clearChat} title="Clear chat">🗑 Clear</button>
          <button className={s.changeKeyBtn} onClick={clearKey} title="Change API key">🔑 Key</button>
        </div>
      </div>

      {/* Quick Commands */}
      <div className={s.quickWrap}>
        <div className={s.quickLabel}>Quick commands:</div>
        <div className={s.quickRow}>
          {QUICK_COMMANDS.map((cmd) => (
            <button key={cmd} className={s.quickChip} onClick={() => sendMessage(cmd)} disabled={loading}>
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className={s.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={`${s.msg} ${msg.role === 'user' ? s.msgUser : s.msgBot}`}>
            {msg.role === 'assistant' && <div className={s.avatar}>✦</div>}
            <div className={`${s.bubble} ${msg.isError ? s.bubbleError : ''}`}>
              {/* Text (supports basic markdown *bold*) */}
              <div className={s.msgText}>
                {msg.text.split('\n').map((line, li) => (
                  <p key={li} style={{ margin: '2px 0' }}>
                    {line.replace(/\*([^*]+)\*/g, '$1')}
                  </p>
                ))}
              </div>

              {/* Tool call results */}
              {msg.toolResults?.length > 0 && (
                <div className={s.toolResults}>
                  {msg.toolResults.map((tr, ti) => (
                    <div key={ti} className={s.toolResult}>
                      <div className={s.toolName}>⚡ {tr.name.replace(/_/g, ' ')}</div>
                      <div className={s.toolResult_text}>{tr.result}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && <div className={`${s.avatar} ${s.avatarUser}`}>U</div>}
          </div>
        ))}

        {loading && (
          <div className={`${s.msg} ${s.msgBot}`}>
            <div className={s.avatar}>✦</div>
            <div className={s.bubble}>
              <div className={s.typing}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={s.inputArea}>
        <textarea
          className={s.input}
          placeholder='e.g. "Add a project called Neural Search Engine" or "Update my LinkedIn URL"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={2}
          id="ai-manager-input"
        />
        <button
          className={s.sendBtn}
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          id="ai-manager-send"
        >
          {loading ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
      <div className={s.hint}>Enter to send • Shift+Enter for new line</div>
    </div>
  )
}
