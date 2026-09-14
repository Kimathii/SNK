import { useState, type FormEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCheck, faEye, faEyeSlash, faGraduationCap, faSliders } from '@fortawesome/free-solid-svg-icons'
import { useAccessibility } from '../context/AccessibilityContext'
import Logo from '../components/Logo'
import './SignUpScreen.css'

type Role = 'student' | 'caregiver'
interface Props {
  mode: 'signup' | 'login'
  onContinue: (role: Role) => void
  onModeChange: () => void
  onBack: () => void
}

export default function SignUpScreen({ mode, onContinue, onModeChange, onBack }: Props) {
  const [role, setRole] = useState<Role>('student')
  const [showPassword, setShowPassword] = useState(false)
  const { openModal } = useAccessibility()
  const isSignup = mode === 'signup'
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onContinue(role)
  }

  return (
    <div className="auth-screen screen">
      <header className="auth-nav">
        <button type="button" onClick={onBack} aria-label="Back to landing page"><FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" /> Back to home</button>
        <button onClick={openModal} aria-label="Accessibility settings"><FontAwesomeIcon icon={faSliders} /></button>
      </header>
      <main className="auth-card">
        <section className="auth-welcome" aria-labelledby="auth-welcome-title">
          <button type="button" className="auth-wordmark" onClick={onBack} aria-label="SNK — back to landing page">
            <Logo size="md" />
          </button>
          <div className="auth-mascot" aria-hidden="true">
            <svg viewBox="0 0 180 215" fill="none">
              <g className="auth-leaves">
                <ellipse cx="90" cy="35" rx="17" ry="30" fill="white" />
                <ellipse cx="64" cy="45" rx="16" ry="23" fill="white" transform="rotate(-25 64 45)" />
                <ellipse cx="116" cy="45" rx="16" ry="23" fill="white" transform="rotate(25 116 45)" />
              </g>
              <ellipse cx="90" cy="140" rx="67" ry="72" fill="white" />
              <g className="auth-face" stroke="#62483E" strokeWidth="5" strokeLinecap="round">
                <path d="M66 133 Q73 126 80 133 M101 133 Q108 126 115 133" />
                <path d="M70 154 Q90 173 112 153" />
              </g>
            </svg>
          </div>
          <h2 id="auth-welcome-title">A little support.<br />A world of possibility.</h2>
          <p>One small step toward a learning journey that feels right.</p>
        </section>
        <section className="auth-form-panel" aria-labelledby="auth-title">
          <p className="auth-eyebrow">{isSignup ? 'Let’s get to know you' : 'Your next little win awaits'}</p>
          <h1 id="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="auth-subtitle">{isSignup ? 'A fresh start, at your own pace.' : 'Choose your space and continue your journey.'}</p>
          <form onSubmit={submit} className="auth-form">
            <fieldset className="auth-roles">
              <legend>{isSignup ? 'I’m signing up as a' : 'I’m logging in as a'}</legend>
              <div className="auth-role-options">
                <button type="button" className={`auth-role ${role === 'student' ? 'auth-role--selected' : ''}`} aria-pressed={role === 'student'} onClick={() => setRole('student')}>
                  <span className="auth-role-icon"><FontAwesomeIcon icon={faGraduationCap} /></span><span>Student</span>{role === 'student' && <FontAwesomeIcon className="auth-role-check" icon={faCheck} />}
                </button>
                <button type="button" className={`auth-role ${role === 'caregiver' ? 'auth-role--selected' : ''}`} aria-pressed={role === 'caregiver'} onClick={() => setRole('caregiver')}>
                  <span className="auth-role-icon auth-role-g" aria-hidden="true">G</span><span>Caregiver</span>{role === 'caregiver' && <FontAwesomeIcon className="auth-role-check" icon={faCheck} />}
                </button>
              </div>
              <p className="auth-role-hint" aria-live="polite">{role === 'student' ? 'Your own space to learn and play.' : 'A space to support your child’s learning.'}</p>
            </fieldset>
            {isSignup && <label className="auth-field">Your name<input name="name" autoComplete="name" placeholder="Enter your name" required maxLength={100} /></label>}
            <label className="auth-field">Email address<input name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required /></label>
            <label className="auth-field" htmlFor="auth-password">Password</label>
            <div className="auth-password-wrap">
              <input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={isSignup ? 8 : undefined} placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'} required aria-describedby={isSignup ? 'auth-password-help' : undefined} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /></button>
            </div>
            {isSignup && <p id="auth-password-help" className="auth-field-help">Use at least 8 characters.</p>}
            <button className="auth-submit" type="submit">{isSignup ? 'Continue' : 'Log in'} as {role === 'student' ? 'Student' : 'Caregiver'}<FontAwesomeIcon icon={faArrowRight} /></button>
            <p className="auth-demo-note">Demo preview. Account creation and password sign-in are not connected yet. Please use sample details.</p>
          </form>
          <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to SNK?'} <button onClick={onModeChange}>{isSignup ? 'Log in' : 'Sign up'}</button></p>
        </section>
      </main>
      <p className="auth-bottom-note">Every mind belongs.</p>
    </div>
  )
}
