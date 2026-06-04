import React, { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, animId
    const particles = []
    const mouse = { x: null, y: null }

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function rand(a, b) { return a + Math.random() * (b - a) }

    function createParticle() {
      const hue = Math.random() > 0.5 ? 38 : Math.random() > 0.5 ? 25 : 340
      return { x: rand(0, W), y: rand(0, H), r: rand(0.8, 2.5), alpha: rand(0.2, 0.6), vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3), hue }
    }

    for (let i = 0; i < 130; i++) particles.push(createParticle())

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMouseMove)

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.save()
            ctx.globalAlpha = (1 - dist / 110) * 0.15
            ctx.strokeStyle = 'hsl(38, 90%, 60%)'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        if (mouse.x !== null) {
          const dx = p.x - mouse.x; const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) { p.x += (dx / dist) * 1.5; p.y += (dy / dist) * 1.5 }
        }
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = `hsl(${p.hue}, 85%, 60%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
      connectParticles()
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }} />
}
