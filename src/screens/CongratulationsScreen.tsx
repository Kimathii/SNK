import { useEffect, useState } from 'react'
import './CongratulationsScreen.css'

interface Props {
  onContinue: () => void
}

export default function CongratulationsScreen({ onContinue }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="congrats-screen screen" onClick={onContinue}>
      <div className={`congrats-content ${show ? 'congrats-content--in' : ''}`}>
        {/* Star mascot */}
        <div className="congrats-mascot">
          <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left arm/leg */}
            <rect x="30" y="130" width="38" height="100" rx="19" fill="#F5C518" transform="rotate(-8 30 130)" />
            {/* Right leg */}
            <rect x="132" y="130" width="38" height="100" rx="19" fill="#F5C518" transform="rotate(8 132 130)" />
            {/* Body triangle */}
            <path d="M100 10 L190 165 L10 165 Z" fill="#F5C518" />
            {/* Face */}
            {/* Left eyebrow */}
            <path d="M65 105 Q75 98 85 105" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Right eyebrow */}
            <path d="M115 105 Q125 98 135 105" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Left eye */}
            <circle cx="75" cy="118" r="7" fill="#1a1a2e" />
            <circle cx="78" cy="115" r="2.5" fill="white" />
            {/* Right eye */}
            <circle cx="125" cy="118" r="7" fill="#1a1a2e" />
            <circle cx="128" cy="115" r="2.5" fill="white" />
            {/* Smile / open mouth */}
            <path d="M80 138 Q100 154 120 138" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Thumbs up arm */}
            <rect x="155" y="80" width="36" height="90" rx="18" fill="#F5C518" transform="rotate(15 155 80)" />
            {/* Thumb fist */}
            <rect x="164" y="58" width="32" height="38" rx="14" fill="#F5C518" stroke="#1a1a2e" strokeWidth="2.5" />
            {/* Thumb up */}
            <rect x="155" y="44" width="16" height="28" rx="8" fill="#F5C518" stroke="#1a1a2e" strokeWidth="2.5" />
            {/* Knuckle lines */}
            <line x1="170" y1="64" x2="193" y2="64" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <line x1="170" y1="72" x2="193" y2="72" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <line x1="170" y1="80" x2="193" y2="80" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="congrats-text">
          <h1>CONGRATULATIONS</h1>
          <p>WE HAVE SUCCESSFULLY PERSONALIZED YOUR APP FOR YOUR CHILD</p>
        </div>

        <button className="congrats-cta" onClick={onContinue}>
          Go to Dashboard →
        </button>

        <p className="congrats-tap-hint">Tap anywhere to continue</p>
      </div>
    </div>
  )
}
