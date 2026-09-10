import React, { useState } from 'react'
import { soundEngine } from '../utils/soundEngine'
import { useAccessibility } from '../context/AccessibilityContext'
import './SpeakButton.css'

interface Props {
  text: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function SpeakButton({ text, label, size = 'sm', className = '' }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const { settings } = useAccessibility()

  if (!settings.ttsEnabled) return null

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPlaying) {
      soundEngine.stopSpeaking()
      setIsPlaying(false)
      return
    }

    setIsPlaying(true)
    soundEngine.speak(text, () => {
      setIsPlaying(false)
    })
  }

  return (
    <button
      type="button"
      className={`speak-btn speak-btn--${size} ${isPlaying ? 'speak-btn--playing' : ''} ${className}`}
      onClick={handleSpeak}
      title={isPlaying ? 'Stop reading' : `Read: "${text}"`}
      aria-label={isPlaying ? 'Stop reading' : `Read aloud: ${text}`}
    >
      <span className="speak-btn-icon">{isPlaying ? '⏹️' : '🔊'}</span>
      {label && <span className="speak-btn-label">{label}</span>}
      {isPlaying && <span className="speak-wave"><span></span><span></span><span></span></span>}
    </button>
  )
}
