import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  decay: number
  isBubble: boolean
}

interface Props {
  triggerKey: number
  x?: number
  y?: number
  color?: string
}

const COLORS = ['#2ECC71', '#4A4FD4', '#F5C518', '#00D2D3', '#FF6B35', '#9B59B6', '#FFFFFF']

export default function SplashParticles({ triggerKey, x, y, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (triggerKey === 0) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const spawnX = x !== undefined ? x : canvas.width / 2
    const spawnY = y !== undefined ? y : canvas.height / 2

    // Create water droplet & bubble burst particles
    const count = 36
    const newParticles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
      const speed = Math.random() * 7 + 3
      const isBubble = Math.random() > 0.4

      newParticles.push({
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isBubble ? 2 : 1),
        radius: Math.random() * 6 + (isBubble ? 4 : 2),
        color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        isBubble,
      })
    }

    particlesRef.current = newParticles

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let aliveCount = 0

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i]
        if (p.alpha <= 0) continue

        aliveCount++
        p.x += p.vx
        p.y += p.vy
        p.vy += p.isBubble ? -0.05 : 0.2 // Bubbles float up, droplets fall with gravity
        p.vx *= 0.96
        p.alpha -= p.decay

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)

        if (p.isBubble) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.strokeStyle = p.color
          ctx.lineWidth = 2
          ctx.stroke()

          // Bubble glint
          ctx.beginPath()
          ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
        }

        ctx.restore()
      }

      if (aliveCount > 0) {
        animFrameRef.current = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [triggerKey, x, y, color])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  )
}
