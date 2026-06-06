import React, { useState, useRef, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { uploadFile } from '../../services/storageService'
import env from '../../config/env'
import styles from './AIAdminChat.module.css'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function replaceAttachedImage(data, attachedUrl) {
  if (typeof data === 'string') {
    return data === 'ATTACHED_IMAGE' ? attachedUrl : data
  }
  if (Array.isArray(data)) {
    return data.map(item => replaceAttachedImage(item, attachedUrl))
  }
  if (typeof data === 'object' && data !== null) {
    const copy = {}
    for (const k in data) {
      copy[k] = replaceAttachedImage(data[k], attachedUrl)
    }
    return copy
  }
  return data
}

async function askGeminiAdmin(userMsg, data, attachedImage, apiKey) {
  const context = `You are an AI admin assistant for K Vignesh's portfolio website with direct database write and management access.
You can read, write, update, and manage the database.

CURRENT DATABASE RECORDS:
${JSON.stringify(data, null, 2)}

OPERATIONAL CAPABILITY:
If the user requests any change to their profile, skills, projects, education, or certifications:
1. Explain what change you are proposing in your text response.
2. If the user provided an image, perform OCR on it, extract the details (like title, issuer, year for certificates; title, description, tech stack for projects), and prepare the database records.
3. If the change involves adding or updating an image (like a certificate or a project thumbnail) with the attached image, set the "imageUrl" property of that item to "ATTACHED_IMAGE" exactly.
4. Output a DATABASE_ACTION tag. Since database edits from images require user confirmation, make sure to set the "confirm" field to true.

Tag format (must be on its own lines at the very end of your response):
[DATABASE_ACTION]
{
  "action": "update_section",
  "section": "personalInfo" | "skillCategories" | "projects" | "education" | "certifications",
  "data": <the complete new object or array for this section>,
  "confirm": true | false
}
[/DATABASE_ACTION]

Rules:
- Be concise.
- Keep the exact data structure intact.
- If the user uploads an image, analyze it (e.g. check if it's a certificate, get title, issuer, year, and add it to certifications; if it's a project screenshot, add to projects).
- If you are proposing to add/update an item from an attached image, always set "confirm": true in the action block.
- If no database changes are requested, do NOT output the [DATABASE_ACTION] block.`

  const promptText = userMsg.trim() || "Analyze the attached image and extract its details to add to my website."
  const parts = [{ text: `${context}\n\nAdmin: ${promptText}\nAssistant:` }]

  if (attachedImage) {
    const mimeType = attachedImage.split(';')[0].split(':')[1] || 'image/jpeg'
    const base64Data = attachedImage.split(',')[1]
    parts.unshift({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    })
  }

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.4 },
    }),
  })
  if (!res.ok) throw new Error('API error')
  const result = await res.json()
  return result.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response.'
}

export default function AIAdminChat() {
  const { data, updateSection } = useData()
  const [msgs, setMsgs] = useState([
    { role: 'ai', text: "Hi! I'm your AI portfolio manager. I have direct write access to your database and can process images (like certificates). You can ask me to update your bio, add projects with photos, or manage certifications directly through this chat!" }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  // Attachment and pending action states
  const fileInputRef = useRef(null)
  const [attachment, setAttachment] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const url = await uploadFile('temp-chat', file)
      setAttachment(url)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to upload image')
    } finally {
      setLoading(false)
    }
    e.target.value = ''
  }

  const send = async () => {
    const msg = input.trim()
    if (!msg && !attachment || loading) return
    setInput('')
    
    // Add user message to UI
    setMsgs((m) => [...m, { role: 'user', text: msg || '📎 [Attached Image]' }])
    setLoading(true)

    try {
      // 1. Check if user is confirming or cancelling a pending action
      if (pendingAction) {
        const isConfirm = /^\s*(yes|ok|upload|yup|sure|confirm|y)\s*$/i.test(msg)
        const isCancel = /^\s*(no|cancel|stop|n)\s*$/i.test(msg)

        if (isConfirm) {
          const updatedData = replaceAttachedImage(pendingAction.data, attachment)
          await updateSection(pendingAction.section, updatedData)
          setMsgs((m) => [
            ...m,
            { role: 'ai', text: `Got it! I have saved the changes and updated your ${pendingAction.section} section in the database.` },
            { role: 'system', text: `⚙️ Database updated: modified '${pendingAction.section}' section.` }
          ])
          setPendingAction(null)
          setAttachment(null)
          setLoading(false)
          return
        } else if (isCancel) {
          setMsgs((m) => [
            ...m,
            { role: 'ai', text: "No problem. I've cancelled the action and won't make any changes." },
            { role: 'system', text: "❌ Action cancelled." }
          ])
          setPendingAction(null)
          setAttachment(null)
          setLoading(false)
          return
        }
      }

      // 2. Normal flow: ask Gemini
      const reply = await askGeminiAdmin(msg, data, attachment, env.geminiApiKey)
      
      // Parse database actions if present
      let cleanReply = reply
      const actionMatch = reply.match(/\[DATABASE_ACTION\]\s*([\s\S]*?)\s*\[\/DATABASE_ACTION\]/)
      
      if (actionMatch) {
        cleanReply = reply.replace(/\[DATABASE_ACTION\][\s\S]*?\[\/DATABASE_ACTION\]/, '').trim()
        try {
          const actionObj = JSON.parse(actionMatch[1].trim())
          if (actionObj.action === 'update_section' && actionObj.section && actionObj.data) {
            if (actionObj.confirm) {
              setPendingAction(actionObj)
              setMsgs((m) => [
                ...m,
                { role: 'ai', text: cleanReply }
              ])
            } else {
              const updatedData = replaceAttachedImage(actionObj.data, attachment)
              await updateSection(actionObj.section, updatedData)
              setMsgs((m) => [
                ...m, 
                { role: 'ai', text: cleanReply },
                { role: 'system', text: `⚙️ Database updated: modified '${actionObj.section}' section.` }
              ])
              setAttachment(null)
            }
            setLoading(false)
            return
          }
        } catch (err) {
          console.error('Failed to parse database action JSON:', err)
        }
      }
      
      setMsgs((m) => [...m, { role: 'ai', text: cleanReply }])
      if (!actionMatch || !JSON.parse(actionMatch?.[1] || '{}').confirm) {
        setAttachment(null)
      }
    } catch (err) {
      console.error(err)
      setMsgs((m) => [...m, { role: 'ai', text: 'Sorry, I had trouble connecting to Gemini. Check your API key.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  if (!env.hasGemini) {
    return (
      <div className={styles.noKey}>
        <div className={styles.noKeyIcon}>🔑</div>
        <h3>Gemini API Key Required</h3>
        <p>Add <code>VITE_GEMINI_API_KEY</code> to your <code>.env</code> file to enable AI admin chat.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.messages}>
        {msgs.map((m, i) => (
          <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.user : m.role === 'system' ? styles.system : styles.ai}`}>
            {m.role === 'ai' && <span className={styles.avatar}>🤖</span>}
            {m.role === 'system' && <span className={styles.avatar}>⚙️</span>}
            <div className={styles.bubble}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className={`${styles.msg} ${styles.ai}`}>
            <span className={styles.avatar}>🤖</span>
            <div className={styles.bubble}><span className={styles.typing}><span/><span/><span/></span></div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      
      {attachment && (
        <div className={styles.previewContainer}>
          <img src={attachment} className={styles.previewImg} alt="Attachment Preview" />
          <button className={styles.removePreview} onClick={() => setAttachment(null)}>✕</button>
        </div>
      )}

      <div className={styles.inputRow}>
        <button className={styles.attachBtn} onClick={() => fileInputRef.current?.click()} type="button" title="Attach Image">
          📷
        </button>
        <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
        <textarea
          className={styles.input}
          placeholder={attachment ? "Describe this image and ask to add it…" : "Ask AI to help update your portfolio…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
          id="ai-admin-input"
        />
        <button className={styles.sendBtn} onClick={send} disabled={(!input.trim() && !attachment) || loading} id="ai-admin-send">↑</button>
      </div>
    </div>
  )
}
