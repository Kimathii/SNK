import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCheck, faHandPointer, faPause, faPlay, faRotateRight, faStar } from '@fortawesome/free-solid-svg-icons'
import { useAccessibility } from '../context/AccessibilityContext'
import { soundEngine } from '../utils/soundEngine'
import SpeakButton from './SpeakButton'
import './LetterCatch.css'

const words = ['CAT', 'SUN', 'DOG']
const choices = [
  [['A', 'C', 'T'], ['T', 'C', 'A'], ['T', 'A', 'C']],
  [['N', 'U', 'S'], ['U', 'S', 'N'], ['S', 'N', 'U']],
  [['D', 'G', 'O'], ['G', 'O', 'D'], ['O', 'D', 'G']],
]

export default function LetterCatch() {
  const { settings } = useAccessibility()
  const [started, setStarted] = useState(false)
  const [round, setRound] = useState(0)
  const [caught, setCaught] = useState(0)
  const [still, setStill] = useState(false)
  const [systemReducedMotion, setSystemReducedMotion] = useState(false)
  const [message, setMessage] = useState('Three little words. One letter at a time.')
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setSystemReducedMotion(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])

  const word = words[round]
  const complete = caught === word.length
  const finished = complete && round === words.length - 1
  const reducedMotion = settings.reducedMotion || systemReducedMotion
  const moving = started && !complete && !still && !reducedMotion
  const target = word[caught]

  function catchLetter(letter: string) {
    if (!started || complete) return
    if (letter !== target) {
      setMessage(`Try ${target}. Match it to the highlighted letter below.`)
      return
    }
    soundEngine.playBubblePop()
    const next = caught + 1
    setCaught(next)
    setMessage(next === word.length
      ? `You made ${word.toLowerCase()}! ${round === words.length - 1 ? 'All three words caught. Well done!' : 'Ready for another word?'}`
      : `${letter} caught! Now find ${word[next]}.`)
  }

  function advance() {
    soundEngine.playClick()
    if (!started || finished) {
      setStarted(true)
      setRound(0)
      setCaught(0)
      setMessage('Catch C to begin your first word.')
    } else {
      setRound(round + 1)
      setCaught(0)
      setMessage(`Catch ${words[round + 1][0]} to begin your next word.`)
    }
  }

  return (
    <section className="lp-section lp-container" id="lp-letter-catch" aria-labelledby="letter-catch-title">
      <div className="lp-section-heading">
        <div><p className="lp-eyebrow">A little play, right here</p><h2 id="letter-catch-title">Catch a letter. Make a word.</h2></div>
        <p>Try it without an account.<br />No timer. No lost points.</p>
      </div>
      <div className="lc-game" data-effects={!still && !reducedMotion}>
        <div className="lc-guide">
          <span className="lp-status"><FontAwesomeIcon icon={faStar} /> Letter Catch</span>
          <h3>Little letters.<br />Lovely discoveries.</h3>
          <p>Find the highlighted letter. Tap or click it to catch it. Collect three letters to build a word.</p>
          <p className="lc-keyboard">Using a keyboard? Tab to a letter, then press Enter or Space.</p>
          <div className="lc-stars" aria-label={`${round + (complete ? 1 : 0)} of 3 words completed`}>
            {words.map((item, index) => <span key={item} className={index < round || (index === round && complete) ? 'lc-star-earned' : ''}><FontAwesomeIcon icon={faStar} aria-hidden="true" /></span>)}
            <span className="lc-progress">{round + (complete ? 1 : 0)} / 3 words</span>
          </div>
          {!started && <button type="button" className="lc-primary" onClick={advance}>
            Let’s catch letters
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </button>}
        </div>
        <div className="lc-playground" data-moving={moving}>
          <div className="lc-toolbar">
            <span>{complete ? 'Word complete!' : started ? `Catch the letter ${target}` : 'Your first word: CAT'}</span>
            <SpeakButton text={complete ? `You made ${word.toLowerCase()}. Well done!` : `Let’s make ${word.toLowerCase()}. Find the letter ${target}.`} size="md" />
          </div>
          <div className="lc-sky" aria-label="Letter choices">
            {!started ? <div className="lc-intro"><FontAwesomeIcon icon={faHandPointer} aria-hidden="true" /><p>A little curiosity goes a long way.</p></div>
              : complete ? <div className="lc-celebration">
                <div className="lc-sparkles" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <span key={index} style={{ left: `${8 + index * 12}%`, animationDelay: `${index * 55}ms` }}><FontAwesomeIcon icon={faStar} /></span>)}</div>
                <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
                <strong>{finished ? 'You caught them all!' : 'Look what you made!'}</strong>
                <span>{word.toLowerCase()}</span>
              </div>
              : choices[round][caught].map((letter, index) => <div className="lc-lane" key={index}><button type="button" className={`lc-letter lc-letter-${index}`} aria-label={`Catch ${letter}`} onClick={() => catchLetter(letter)}>{letter}</button></div>)}
          </div>
          <div className="lc-basket" aria-label={`Word to build: ${word.toLowerCase()}. ${caught} of 3 letters caught.`}>
            {word.split('').map((letter, index) => <span key={index} className={`lc-slot ${index < caught ? 'lc-slot-caught' : ''} ${index === caught ? 'lc-slot-target' : ''}`} aria-hidden="true">{letter}{index < caught && <FontAwesomeIcon icon={faCheck} />}</span>)}
          </div>
          <p className="lc-feedback" role="status" aria-live="polite" aria-atomic="true">{message}</p>
          {complete && <button type="button" className="lc-primary lc-next" onClick={advance} autoFocus>
            {finished ? 'Play again' : 'Next word'}
            <FontAwesomeIcon icon={finished ? faRotateRight : faArrowRight} aria-hidden="true" />
          </button>}
          <div className="lc-controls"><span>Word {round + 1} of 3</span><button type="button" onClick={() => setStill(!still)} aria-pressed={still || reducedMotion} disabled={reducedMotion}><FontAwesomeIcon icon={still || reducedMotion ? faPlay : faPause} aria-hidden="true" />{reducedMotion ? 'Letters stay still' : still ? 'Let letters float' : 'Keep letters still'}</button></div>
        </div>
      </div>
    </section>
  )
}
