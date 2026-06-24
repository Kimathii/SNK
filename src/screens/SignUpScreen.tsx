import { useState } from 'react'
import type { UserRole } from '../App'
import './SignUpScreen.css'

interface Props {
  onContinue: (role: UserRole) => void
}

export default function SignUpScreen({ onContinue }: Props) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(null)

  const handleSubmit = () => {
    if (email.trim()) {
      onContinue(role ?? 'caregiver')
    }
  }

  return (
    <div className="signup-screen screen">
      {/* Green top section with mascot */}
      <div className="signup-hero">
        <div className="signup-mascot">
          {/* Calm plant-head mascot SVG */}
          <svg viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Leaves on head */}
            <ellipse cx="80" cy="28" rx="16" ry="22" fill="white" transform="rotate(-15 80 28)" />
            <ellipse cx="80" cy="28" rx="16" ry="22" fill="white" transform="rotate(15 80 28)" />
            <ellipse cx="80" cy="20" rx="14" ry="20" fill="white" />
            <ellipse cx="55" cy="35" rx="12" ry="18" fill="white" transform="rotate(-30 55 35)" />
            <ellipse cx="105" cy="35" rx="12" ry="18" fill="white" transform="rotate(30 105 35)" />

            {/* Body */}
            <ellipse cx="80" cy="120" rx="60" ry="65" fill="white" />

            {/* Face */}
            {/* Left eye */}
            <path d="M58 108 Q64 103 70 108" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Right eye */}
            <path d="M90 108 Q96 103 102 108" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Smile */}
            <path d="M62 125 Q80 140 98 125" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>

      {/* White bottom section */}
      <div className="signup-body">
        <h1 className="signup-title">SIGN UP</h1>

        <input
          className="signup-input"
          type="email"
          placeholder="ENTER EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="signup-oauth">
          <button
            className={`oauth-btn ${role === 'caregiver' ? 'oauth-btn--active' : ''}`}
            onClick={() => setRole('caregiver')}
            title="Sign up as Caregiver (Google)"
          >
            G
          </button>
          <button
            className={`oauth-btn ${role === 'student' ? 'oauth-btn--active' : ''}`}
            onClick={() => setRole('student')}
            title="Sign up as Student (Facebook)"
          >
            F
          </button>
        </div>

        <p className="signup-hint">Tap G for Caregiver · F for Student</p>

        <button
          className={`signup-cta ${email.trim() ? 'signup-cta--active' : ''}`}
          onClick={handleSubmit}
          disabled={!email.trim()}
        >
          Continue
        </button>

        <div className="signup-login">
          <p>ALREADY HAVE AN ACCOUNT</p>
          <button className="signup-login-link" onClick={() => onContinue('caregiver')}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  )
}
