import { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import './SplashScreen.css'

interface Props {
  onNext: () => void
}

export default function SplashScreen({ onNext }: Props) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Trigger logo entrance
    const timer = setTimeout(() => setAnimate(true), 150)
    // Automatically transition to next screen after splash display
    const nextTimer = setTimeout(() => onNext(), 2200)

    return () => {
      clearTimeout(timer)
      clearTimeout(nextTimer)
    }
  }, [onNext])

  return (
    <div className="splash-screen" onClick={onNext} role="button" tabIndex={0} aria-label="Skip splash">
      <div className={`splash-logo ${animate ? 'splash-logo--in' : ''}`}>
        <Logo size="xl" />
      </div>
    </div>
  )
}
