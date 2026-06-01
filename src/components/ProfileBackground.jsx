import { useEffect, useRef } from 'react'

const STARS = Array.from({ length: 200 }, (_, i) => {
  let s = (i + 1) * 1664525 + 1013904223
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
  return {
    x:     rand(),
    y:     rand(),
    r:     rand() * 1.4 + 0.2,
    a:     rand() * 0.6 + 0.2,
    twinkleSpeed: rand() * 0.02 + 0.005,
    twinkleOffset: rand() * Math.PI * 2,
  }
})

export default function ProfileBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId
    let frame = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGrad.addColorStop(0, '#04091c')
      bgGrad.addColorStop(1, '#070e22')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      STARS.forEach(s => {
        const twinkle = s.a * (0.6 + 0.4 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset))
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`
        ctx.fill()
      })

      frame++
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
