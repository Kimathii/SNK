import { useRef, useState, useEffect, useCallback } from 'react'
import { TracePath } from '../gameData'
import './TraceCanvas.css'

interface Props {
  traceCharacter: string
  tracePaths: TracePath[]
  guideLevel?: 'full' | 'medium' | 'minimal'
  onComplete: (accuracy: number) => void
  onSplashBurst: (x: number, y: number) => void
}

export default function TraceCanvas({
  traceCharacter,
  tracePaths,
  guideLevel = 'full',
  onComplete,
  onSplashBurst,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<number[]>([])
  const [userStrokePoints, setUserStrokePoints] = useState<{ x: number; y: number }[]>([])
  const [completedPaths, setCompletedPaths] = useState<number[]>([])

  const activePath = tracePaths[currentPathIndex] || tracePaths[0]

  // Clear canvas and draw guides
  const drawGuideAndStrokes = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const w = canvas.width
    const h = canvas.height

    // Draw background reference letter
    ctx.save()
    ctx.font = `900 ${Math.min(w, h) * 0.7}px 'Fredoka One', cursive, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = guideLevel === 'minimal' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.12)'
    ctx.fillText(traceCharacter, w / 2, h / 2 + 10)
    ctx.restore()

    // Draw all guide paths
    tracePaths.forEach((path, pIdx) => {
      const isCurrent = pIdx === currentPathIndex
      const isDone = completedPaths.includes(pIdx)

      if (path.points.length < 2) return

      ctx.save()
      ctx.beginPath()
      const p0 = path.points[0]
      ctx.moveTo((p0.x / 100) * w, (p0.y / 100) * h)

      for (let i = 1; i < path.points.length; i++) {
        const pt = path.points[i]
        ctx.lineTo((pt.x / 100) * w, (pt.y / 100) * h)
      }

      if (isDone) {
        ctx.strokeStyle = '#2ECC71'
        ctx.lineWidth = 14
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      } else if (isCurrent && guideLevel !== 'minimal') {
        ctx.strokeStyle = 'rgba(245, 197, 24, 0.4)'
        ctx.lineWidth = 18
        ctx.lineCap = 'round'
        ctx.setLineDash([12, 10])
        ctx.stroke()
      }
      ctx.restore()

      // Draw starting point (Green pulse) and checkpoints
      if (isCurrent && !isDone) {
        path.points.forEach((pt, ptIdx) => {
          const px = (pt.x / 100) * w
          const py = (pt.y / 100) * h
          const isVisited = visitedCheckpoints.includes(ptIdx)
          const isStart = ptIdx === 0

          ctx.save()
          ctx.beginPath()
          ctx.arc(px, py, isStart ? 14 : 7, 0, Math.PI * 2)

          if (isVisited) {
            ctx.fillStyle = '#2ECC71'
          } else if (isStart) {
            ctx.fillStyle = '#FFD700'
            ctx.shadowColor = '#FFD700'
            ctx.shadowBlur = 10
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
          }
          ctx.fill()
          ctx.restore()
        })
      }
    })

    // Draw active user stroke
    if (userStrokePoints.length > 1) {
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(userStrokePoints[0].x, userStrokePoints[0].y)
      for (let i = 1; i < userStrokePoints.length; i++) {
        ctx.lineTo(userStrokePoints[i].x, userStrokePoints[i].y)
      }
      ctx.strokeStyle = '#00D2D3'
      ctx.lineWidth = 12
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = '#00D2D3'
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.restore()
    }
  }, [traceCharacter, tracePaths, currentPathIndex, visitedCheckpoints, userStrokePoints, completedPaths, guideLevel])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    drawGuideAndStrokes()
  }, [drawGuideAndStrokes])

  // Get pointer coordinates relative to canvas
  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    return { x: 0, y: 0 }
  }

  // Check proximity to checkpoints
  const checkHit = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas || !activePath) return

    const w = canvas.width
    const h = canvas.height
    const tolerance = 48 // Forgiving radius for children / motor coordination

    activePath.points.forEach((pt, ptIdx) => {
      const px = (pt.x / 100) * w
      const py = (pt.y / 100) * h
      const dist = Math.hypot(x - px, y - py)

      if (dist < tolerance && !visitedCheckpoints.includes(ptIdx)) {
        // Enforce sequential or near-sequential completion
        const lastVisited = visitedCheckpoints.length > 0 ? visitedCheckpoints[visitedCheckpoints.length - 1] : -1
        if (ptIdx === 0 || ptIdx === lastVisited + 1 || ptIdx === lastVisited) {
          setVisitedCheckpoints((prev) => [...prev, ptIdx])
          onSplashBurst(px, py)
        }
      }
    })
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const pt = getCoords(e)
    setUserStrokePoints([pt])
    checkHit(pt.x, pt.y)
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const pt = getCoords(e)
    setUserStrokePoints((prev) => [...prev, pt])
    checkHit(pt.x, pt.y)
  }

  const handleEnd = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    if (!activePath) return
    const totalPoints = activePath.points.length
    const hitCount = visitedCheckpoints.length
    const accuracy = Math.round((hitCount / totalPoints) * 100)

    if (accuracy >= 60) {
      // Completed current stroke!
      const nextCompleted = [...completedPaths, currentPathIndex]
      setCompletedPaths(nextCompleted)
      setVisitedCheckpoints([])
      setUserStrokePoints([])

      if (nextCompleted.length >= tracePaths.length) {
        // All strokes completed
        onComplete(Math.max(85, accuracy))
      } else {
        // Move to next stroke
        setCurrentPathIndex((idx) => idx + 1)
      }
    } else {
      // Try stroke again softly
      setUserStrokePoints([])
      setVisitedCheckpoints([])
    }
  }

  const handleClear = () => {
    setUserStrokePoints([])
    setVisitedCheckpoints([])
    setCompletedPaths([])
    setCurrentPathIndex(0)
  }

  return (
    <div className="trace-container">
      <div className="trace-card">
        <canvas
          ref={canvasRef}
          className="trace-canvas"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        <div className="trace-hint-bar">
          <span className="trace-hint-text">
            {activePath?.instruction || 'Start at the bright yellow dot & follow the path!'}
          </span>
          <button className="trace-clear-btn" onClick={handleClear} title="Restart Letter">
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  )
}
