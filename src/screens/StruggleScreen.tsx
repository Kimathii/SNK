import { useState } from 'react'
import './StruggleScreen.css'

interface Props {
  onSelect: (struggle: string) => void
}

const STRUGGLES = [
  {
    id: 'SLD',
    label: 'SLD',
    subtitle: 'Dyslexia, Dyscalculia, Dysgraphia',
    description: 'Specific Learning Disabilities affecting reading, math, and writing',
  },
  {
    id: 'DND',
    label: 'DND',
    subtitle: 'ASD, ADHD, SLP',
    description: 'Developmental & Neurodevelopmental Disorders',
  },
]

export default function StruggleScreen({ onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="struggle-screen screen">
      <div className="struggle-content">
        <h1 className="struggle-title">WHAT BEST DESCRIBE YOUR CHILD'S STRUGGLE</h1>
        <p className="struggle-hint">SELECT BUTTONS BELOW</p>

        <div className="struggle-options">
          {STRUGGLES.map((s) => (
            <button
              key={s.id}
              className={`struggle-option ${selected === s.id ? 'struggle-option--selected' : ''}`}
              onClick={() => setSelected(s.id)}
            >
              <span className="struggle-option__label">{s.label}</span>
              <span className="struggle-option__sub">{s.subtitle}</span>
            </button>
          ))}
        </div>

        <button className="struggle-learn-more" onClick={() => setShowInfo(!showInfo)}>
          LEARN MORE ABOUT THE STRUGGLES
        </button>

        {showInfo && selected && (
          <div className="struggle-info">
            <p>{STRUGGLES.find((s) => s.id === selected)?.description}</p>
          </div>
        )}

        {selected && (
          <button className="struggle-continue" onClick={() => onSelect(selected)}>
            Continue
          </button>
        )}
      </div>

      {/* Mascot flame character at bottom */}
      <div className="struggle-mascot">
        <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Flame body */}
          <path
            d="M70 155 C35 155 15 128 15 100 C15 75 30 60 30 45 C30 30 40 20 50 15 C48 28 55 35 60 30 C58 50 75 55 70 70 C80 55 85 35 80 20 C92 28 100 40 100 55 C105 45 108 30 105 15 C120 28 125 50 125 75 C125 110 110 155 70 155Z"
            fill="url(#flameGrad)"
          />
          {/* Inner orange */}
          <path
            d="M70 145 C48 145 34 125 34 105 C34 88 44 78 50 65 C50 80 60 85 65 78 C63 92 72 96 70 108 C76 96 80 82 78 70 C88 80 92 95 92 108 C92 128 90 145 70 145Z"
            fill="#FF8C42"
          />
          {/* White eye highlights */}
          <circle cx="55" cy="100" r="14" fill="white" />
          <circle cx="85" cy="100" r="14" fill="white" />
          {/* Pupils */}
          <circle cx="57" cy="102" r="8" fill="#3D1C02" />
          <circle cx="87" cy="102" r="8" fill="#3D1C02" />
          {/* Shine */}
          <circle cx="60" cy="98" r="3" fill="white" />
          <circle cx="90" cy="98" r="3" fill="white" />
          {/* Eyebrows */}
          <path d="M48 85 Q55 80 62 85" stroke="#8B2500" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M78 85 Q85 80 92 85" stroke="#8B2500" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Smile */}
          <path d="M60 118 Q70 126 80 118" stroke="#8B2500" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Gradient */}
          <defs>
            <linearGradient id="flameGrad" x1="70" y1="15" x2="70" y2="155" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF4500" />
              <stop offset="50%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#FF8C42" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
