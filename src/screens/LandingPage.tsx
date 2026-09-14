import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowUp, faArrowUpRightFromSquare, faCheck, faFont, faGamepad, faHeart, faPlus, faSliders, faStar, faWater } from '@fortawesome/free-solid-svg-icons'
import SpeakButton from '../components/SpeakButton'
import LetterCatch from '../components/LetterCatch'
import Logo from '../components/Logo'
import { useAccessibility } from '../context/AccessibilityContext'
import './LandingPage.css'

interface Props { onSignUp: () => void; onLogin: () => void }
const steps = [
  { number: '01', title: 'Make it yours', text: 'Choose a student or caregiver view. Tell us what your child wants to practise.' },
  { number: '02', title: 'Find a little adventure', text: 'Explore letters, sounds, and words in WordSplash. Start at any level.' },
  { number: '03', title: 'Celebrate each step', text: 'Collect stars as you play. Come back to your saved progress whenever you like.' },
]

export default function LandingPage({ onSignUp, onLogin }: Props) {
  const { settings, updateSetting, openModal, activeLayout } = useAccessibility()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page || !('IntersectionObserver' in window) || !('animate' in page)) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const animations = new Set<Animation>()
    const revealed = new WeakSet<Element>()
    let observer: IntersectionObserver | undefined
    const stop = () => {
      observer?.disconnect()
      animations.forEach(animation => animation.cancel())
      animations.clear()
      delete page.dataset.motionEnabled
    }
    const start = () => {
      stop()
      if (settings.reducedMotion || preference.matches) return
      page.dataset.motionEnabled = 'true'
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer?.unobserve(entry.target)
          if (revealed.has(entry.target)) continue
          revealed.add(entry.target)
          const element = entry.target as HTMLElement
          // Never conceal a control while someone is navigating with a keyboard.
          if (element.contains(document.activeElement)) continue
          const siblings = Array.from(element.parentElement?.children || [])
          const stagger = element.matches('.lp-hero-copy > *, .lp-step, .lp-family-notes article, .lp-footer-top > *')
            ? Math.min(siblings.indexOf(element), 4) * 75 : 0
          const photo = element.classList.contains('lp-hero-image')
          const animation = element.animate(
            photo
              ? [{ transform: 'scale(1.035)' }, { transform: 'scale(1)' }]
              : [{ opacity: 0.15, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: photo ? 1200 : 650, delay: stagger, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
          )
          animations.add(animation)
          animation.onfinish = () => animations.delete(animation)
        }
      }, { threshold: 0.08 })
      page.querySelectorAll('.lp-hero-image, .lp-hero-copy > *, .lp-comfort, .lp-section-heading, .lp-step, .lp-game-feature, .lp-together > div:first-child, .lp-family-notes article, .lp-final-cta, .lp-footer-top > *, .lp-footer-wordmark')
        .forEach(element => observer?.observe(element))
    }
    const onFocus = () => {
      animations.forEach(animation => {
        const target = (animation.effect as KeyframeEffect | null)?.target
        if (target instanceof Element && target.contains(document.activeElement)) {
          animation.cancel()
          animations.delete(animation)
        }
      })
    }
    start()
    preference.addEventListener('change', start)
    page.addEventListener('focusin', onFocus)
    return () => {
      stop()
      preference.removeEventListener('change', start)
      page.removeEventListener('focusin', onFocus)
    }
  }, [settings.reducedMotion])

  return (
    <div ref={pageRef} className={`landing-screen screen ${activeLayout === 'phone' ? 'lp-phone' : ''}`}>
      <div className="screen-scroll lp-scroll">
        <a className="lp-skip" href="#lp-main">Skip to main content</a>
        <header className="lp-nav lp-container">
          <a href="#lp-top" className="lp-brand"><Logo /><span className="lp-brand-caption">Little steps. Big possibilities.</span></a>
          <nav aria-label="Main navigation" className="lp-nav-links">
            <a href="#lp-how">How it works</a><a href="#lp-games">Our games</a>
            <button onClick={onLogin} className="lp-login-link">Log in <span aria-hidden="true"><FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" /></span></button>
          </nav>
        </header>
        <main id="lp-main" tabIndex={-1}>
          <section className="lp-hero lp-hero-photo lp-container" id="lp-top" aria-labelledby="lp-title">
            <img
              className="lp-hero-image"
              src={new URL('../../assets/header.jpg', import.meta.url).href}
              alt="A child exploring a wooden alphabet puzzle with colorful letters."
              width={1920}
              height={1280}
              fetchPriority="high"
            />
            <div className="lp-hero-copy">
              <p className="lp-eyebrow"><span aria-hidden="true"><FontAwesomeIcon icon={faStar} aria-hidden="true" /></span> A little different. A lot of possibility.</p>
              <h1 id="lp-title">Learning at<br /><span>their own pace.</span></h1>
              <p className="lp-hero-sub">Different minds deserve room to grow. Discover playful learning for children with different learning needs.</p>
              <div className="lp-hero-actions">
                <button className="lp-primary" onClick={onSignUp}>Get started <span aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></span></button>
                <SpeakButton text="Welcome to SNK. Learning at their own pace. Discover playful learning for children with different learning needs. Start with WordSplash, or adjust your reading settings to make yourself comfortable." label="Listen to this" size="md" />
              </div>
              <p className="lp-hero-note">A small step today. A new possibility tomorrow.</p>
            </div>
          </section>
          <section className="lp-comfort lp-container" aria-label="Reading preferences">
            <div><span className="lp-comfort-icon" aria-hidden="true"><FontAwesomeIcon icon={faFont} /></span><div><h2>Make yourself comfortable.</h2><p>Your screen. Your way.</p></div></div>
            <div className="lp-comfort-controls">
              <button aria-pressed={settings.dyslexicFont} onClick={() => updateSetting('dyslexicFont', !settings.dyslexicFont)}>Reading font <span aria-hidden="true"><FontAwesomeIcon icon={settings.dyslexicFont ? faCheck : faPlus} aria-hidden="true" /></span></button>
              <button aria-pressed={settings.calmMode} onClick={() => updateSetting('calmMode', !settings.calmMode)}>Calm colors <span aria-hidden="true"><FontAwesomeIcon icon={settings.calmMode ? faCheck : faPlus} aria-hidden="true" /></span></button>
              <button onClick={openModal}>All settings <span aria-hidden="true"><FontAwesomeIcon icon={faSliders} aria-hidden="true" /></span></button>
            </div>
          </section>
          <LetterCatch />
          <section className="lp-section lp-container" id="lp-how" aria-labelledby="lp-how-title">
            <div className="lp-section-heading"><div><p className="lp-eyebrow">Small steps, every day</p><h2 id="lp-how-title">A simple place to begin.</h2></div><p>No rush. No race.<br />Just a little room to try.</p></div>
            <div className="lp-steps">{steps.map(step => <article key={step.number} className="lp-step"><span className="lp-step-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
          </section>
          <section className="lp-section lp-container" id="lp-games" aria-labelledby="lp-games-title">
            <div className="lp-section-heading"><div><p className="lp-eyebrow">A world of little wins</p><h2 id="lp-games-title">Play with purpose.</h2></div><p>One activity at a time.<br />Plenty of chances to try again.</p></div>
            <div className="lp-game-feature">
              <div className="lp-game-art" aria-hidden="true"><span className="lp-game-orbit"><FontAwesomeIcon icon={faStar} aria-hidden="true" /></span><div className="lp-word-tiles"><span>C</span><span>A</span><span>T</span></div><span className="lp-game-wave"><FontAwesomeIcon icon={faWater} aria-hidden="true" /></span><p>Letters become possibilities.</p></div>
              <div className="lp-game-copy"><span className="lp-status">Ready to explore</span><h3>WordSplash</h3><p>Pop letters. Build words. Trace new shapes. Turn reading practice into a little adventure.</p><ul><li><FontAwesomeIcon icon={faCheck} aria-hidden="true" />5 worlds to discover</li><li><FontAwesomeIcon icon={faCheck} aria-hidden="true" />50 levels, all open to explore</li><li><FontAwesomeIcon icon={faCheck} aria-hidden="true" />Listen to words as you learn</li></ul><button className="lp-text-link" onClick={onSignUp}>Start your adventure <span aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></span></button></div>
            </div>
          </section>
          <section className="lp-section lp-container lp-together" id="lp-families" aria-labelledby="lp-families-title">
            <div><p className="lp-eyebrow">Different minds. Shared possibilities.</p><h2 id="lp-families-title">For your child.<br />And for you, too.</h2><p>Some days are for exploring. Others are for trying again. There is space for both here.</p><div className="lp-needs"><span>Dyslexia</span><span>ADHD</span><span>Different learning needs</span></div></div>
            <div className="lp-family-notes"><article><span aria-hidden="true"><FontAwesomeIcon icon={faGamepad} aria-hidden="true" /></span><div><h3>A space for children</h3><p>Playful practice, gentle encouragement, and stars for every little win.</p></div></article><article><span aria-hidden="true"><FontAwesomeIcon icon={faHeart} aria-hidden="true" /></span><div><h3>A space for caregivers</h3><p>Explore the caregiver and family views. Preview profiles and example progress reports.</p></div></article><article><span aria-hidden="true"><FontAwesomeIcon icon={faFont} /></span><div><h3>Comfort comes first</h3><p>Adjust the text, colors, motion, and sound to find what feels right.</p></div></article></div>
          </section>
          <section className="lp-final-wrap lp-container" aria-labelledby="lp-ready-title"><div className="lp-final-cta"><span className="lp-final-star" aria-hidden="true"><FontAwesomeIcon icon={faStar} aria-hidden="true" /></span><div><p className="lp-eyebrow">Start small. See where it goes.</p><h2 id="lp-ready-title">Their next little win<br />starts here.</h2><p>Let’s find their way to learn.</p></div><button className="lp-primary" onClick={onSignUp}>Get started <span aria-hidden="true"><FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></span></button></div></section>
        </main>
        <footer className="lp-footer">
          <div className="lp-footer-top lp-container">
            <div className="lp-footer-brand"><a href="#lp-top" aria-label="SNK, back to top"><Logo /></a><p>A little support.<br />A world of possibility.</p><span>© {new Date().getFullYear()} SNK.<br />All rights reserved.</span></div>
            <nav aria-label="Discover"><h2>Discover</h2><a href="#lp-how">How it works</a><a href="#lp-games">WordSplash</a><a href="#lp-families">For families</a></nav>
            <nav aria-label="Your space"><h2>Your space</h2><button onClick={onSignUp}>Get started</button><button onClick={onLogin}>Log in</button><a href="#lp-games">Explore learning</a></nav>
            <nav aria-label="Make it yours"><h2>Make it yours</h2><button onClick={openModal}>Accessibility settings</button><button onClick={() => updateSetting('dyslexicFont', !settings.dyslexicFont)} aria-pressed={settings.dyslexicFont}>Reading font {settings.dyslexicFont && <FontAwesomeIcon icon={faCheck} aria-hidden="true" />}</button><button onClick={() => updateSetting('calmMode', !settings.calmMode)} aria-pressed={settings.calmMode}>Calm colors {settings.calmMode && <FontAwesomeIcon icon={faCheck} aria-hidden="true" />}</button></nav>
          </div>
          <div className="lp-footer-wordmark" aria-hidden="true">SNK<span><FontAwesomeIcon icon={faStar} aria-hidden="true" /></span></div>
          <div className="lp-footer-bottom lp-container"><span>Every mind belongs.</span><a href="#lp-top">Back to top <FontAwesomeIcon icon={faArrowUp} aria-hidden="true" /></a></div>
        </footer>
      </div>
    </div>
  )
}
import { useEffect, useRef } from 'react'
