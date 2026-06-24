import { useEffect, useState } from 'react'
import './SplashScreen.css'

interface Props {
  onNext: () => void
}

export default function SplashScreen({ onNext }: Props) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(onNext, 2800)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <div className="splash-screen">
      <div className={`splash-logo ${animate ? 'splash-logo--in' : ''}`}>
        {/* Stars */}
        <div className="splash-stars">
          <span className="star star--sm star--purple">★</span>
          <span className="star star--md star--yellow">★</span>
          <span className="star star--lg star--yellow">★</span>
          <span className="star star--md star--yellow">★</span>
          <span className="star star--sm star--purple">★</span>
        </div>

        {/* Logo badge */}
        <div className="splash-badge">
          <div className="splash-badge__green-hill" />
          <div className="splash-badge__dark">
            <span className="snk-letter snk-letter--s">S</span>
            <span className="snk-letter snk-letter--n">N</span>
            <span className="snk-letter snk-letter--k">K</span>
            <div className="splash-badge__feet">👣</div>
          </div>
        </div>
      </div>
    </div>
  )
}
