import React, { useEffect, useRef, useState } from 'react'
import { useChatbot } from '../context/ChatbotContext'
import { usePortfolioData } from '../context/PortfolioDataContext'
import styles from './Hero.module.css'

function useTypewriter(words) {
  const [text, setText] = useState('')
  const idx = useRef(0)
  const charIdx = useRef(0)
  const deleting = useRef(false)

  useEffect(() => {
    let timer
    function type() {
      const current = words[idx.current]
      if (!deleting.current) {
        setText(current.slice(0, charIdx.current + 1))
        charIdx.current++
        if (charIdx.current === current.length) {
          deleting.current = true
          timer = setTimeout(type, 1800)
          return
        }
      } else {
        setText(current.slice(0, charIdx.current - 1))
        charIdx.current--
        if (charIdx.current === 0) {
          deleting.current = false
          idx.current = (idx.current + 1) % words.length
        }
      }
      timer = setTimeout(type, deleting.current ? 55 : 90)
    }
    timer = setTimeout(type, 400)
    return () => clearTimeout(timer)
  }, [words])

  return text
}

export default function Hero() {
  const { data } = usePortfolioData()
  const { personalInfo } = data
  const { openChat } = useChatbot()
  const typeText = useTypewriter(personalInfo.typewriterWords)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.content}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Available for Opportunities
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          <span className={styles.greeting}>Hello, I'm</span>
          <span className={`${styles.name} gradient-text`}>{personalInfo.name}</span>
        </h1>

        {/* Typewriter */}
        <div className={styles.subtitleWrap}>
          <span className={styles.subtitleStatic}>I build </span>
          <span className={styles.typewriter}>{typeText}</span>
          <span className={styles.cursor}>|</span>
        </div>

        {/* Description */}
        <p className={styles.desc}>
          Backend &amp; Cloud Architect pioneering AI-integrated applications.<br />
          Building where <span className="highlight-text">infrastructure meets intelligence</span>.
        </p>

        {/* CTAs */}
        <div className={styles.ctaGroup}>
          <a href="#projects" className="btn-primary" id="view-projects-btn">View Projects</a>
          <button className={styles.aiBtn} onClick={openChat} id="ai-chat-btn">
            <span className={styles.aiIcon}>✦</span> Ask My AI
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {personalInfo.stats.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className={styles.statItem}>
                <span className={`${styles.statNum} gradient-text`}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
              {i < personalInfo.stats.length - 1 && <div className={styles.statDivider} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Code Card Visual */}
      <div className={styles.visual}>
        <div className={styles.cardFloat}>
          <div className={styles.codeCard}>
            <div className={styles.cardHeader}>
              <span className={`${styles.dot} ${styles.red}`} />
              <span className={`${styles.dot} ${styles.yellow}`} />
              <span className={`${styles.dot} ${styles.green}`} />
              <span className={styles.filename}>architect.py</span>
            </div>
            <pre className={styles.codeBody}>
              <span className={styles.cPurple}>class</span>{' '}
              <span className={styles.cGold}>Vignesh</span>:{'\n'}
              {'  '}<span className={styles.cPurple}>def</span>{' '}
              <span className={styles.cCyan}>__init__</span>(self):{'\n'}
              {'    '}self.role = <span className={styles.cOrange}>"Cloud Architect"</span>{'\n'}
              {'    '}self.focus = [{'\n'}
              {'      '}<span className={styles.cOrange}>"AI Agents"</span>,{'\n'}
              {'      '}<span className={styles.cOrange}>"Backend Systems"</span>,{'\n'}
              {'      '}<span className={styles.cOrange}>"Cloud Infra"</span>{'\n'}
              {'    '}]{'\n'}
              {'\n'}
              {'  '}<span className={styles.cPurple}>def</span>{' '}
              <span className={styles.cCyan}>build</span>(self, idea):{'\n'}
              {'    '}<span className={styles.cPurple}>return</span> idea +{' '}
              <span className={styles.cOrange}>" × AI"</span>
            </pre>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator} style={{ opacity: scrolled ? 0 : 1 }}>
        <div className={styles.scrollMouse}><div className={styles.scrollWheel} /></div>
        <span>Scroll</span>
      </div>
    </section>
  )
}
