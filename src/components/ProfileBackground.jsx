import { useEffect, useRef } from 'react'

function newFaller(canvasWidth, canvasHeight, spread = false) {
  return {
    x:     Math.random() * canvasWidth,
    y:     spread ? Math.random() * canvasHeight : -10 - Math.random() * 60,
    vy:    1.2 + Math.random() * 2.6,
    vx:    (Math.random() - 0.5) * 0.25,
    size:  0.5 + Math.random() * 1.1,
    tail:  14 + Math.random() * 22,
    alpha: 0.35 + Math.random() * 0.55,
  }
}

// Static background stars — computed once
const BG_STARS = Array.from({ length: 90 }, (_, i) => {
  let s = (i + 1) * 1664525 + 1013904223
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
  return { x: rand(), y: rand(), r: rand() * 0.7 + 0.2, a: rand() * 0.4 + 0.1 }
})

export default function ProfileBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const fallers = Array.from({ length: 110 }, () =>
      newFaller(canvas.width, canvas.height, true)
    )

    function draw() {
      // Deep space background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGrad.addColorStop(0, '#04091c')
      bgGrad.addColorStop(1, '#070e22')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Static background stars
      BG_STARS.forEach(s => {
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.a})`
        ctx.fill()
      })

      // Falling stars
      fallers.forEach(s => {
        // Tail gradient — fades from transparent at top to bright at head
        const grad = ctx.createLinearGradient(s.x, s.y - s.tail, s.x, s.y)
        grad.addColorStop(0, 'rgba(180,210,255,0)')
        grad.addColorStop(1, `rgba(220,238,255,${s.alpha})`)

        ctx.beginPath()
        ctx.strokeStyle = grad
        ctx.lineWidth   = s.size
        ctx.lineCap     = 'round'
        ctx.moveTo(s.x, s.y - s.tail)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()

        // Bright head dot
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 0.85, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
        ctx.fill()

        // Advance position
        s.x += s.vx
        s.y += s.vy

        // Reset once past bottom
        if (s.y - s.tail > canvas.height) {
          Object.assign(s, newFaller(canvas.width, canvas.height, false))
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
