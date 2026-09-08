import { useState, useEffect, useCallback } from 'react'
import {
  GameState,
  loadGameState,
  saveGameState,
  AccessibilitySettings,
  DEFAULT_ACCESSIBILITY,
} from './gameState'
import { WORLDS_DATA, WorldData, LevelData } from './gameData'
import { soundEngine } from './audio'
import WorldMap from './components/WorldMap'
import LevelSelect from './components/LevelSelect'
import TraceCanvas from './components/TraceCanvas'
import AccessibilityModal from './components/AccessibilityModal'
import SplashParticles from './components/SplashParticles'
import './WordSplashGame.css'

interface Props {
  onBackToApp: () => void
}

type ViewState = 'map' | 'level-select' | 'playing'

export default function WordSplashGame({ onBackToApp }: Props) {
  const [gameState, setGameState] = useState<GameState>(loadGameState)
  const [view, setView] = useState<ViewState>('map')
  const [selectedWorldId, setSelectedWorldId] = useState<number>(1)
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1)
  const [showSettings, setShowSettings] = useState(false)

  // In-Game state
  const [poppedBubbleIds, setPoppedBubbleIds] = useState<string[]>([])
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([])
  const [availableLetters, setAvailableLetters] = useState<{ id: string; char: string; used: boolean }[]>([])
  const [selectedWordOptionId, setSelectedWordOptionId] = useState<string | null>(null)
  const [wobbleId, setWobbleId] = useState<string | null>(null)

  // Results & Particle State
  const [showCelebration, setShowCelebration] = useState(false)
  const [levelStars, setLevelStars] = useState(3)
  const [levelAccuracy, setLevelAccuracy] = useState(100)
  const [particleTrigger, setParticleTrigger] = useState(0)
  const [particleOrigin, setParticleOrigin] = useState<{ x: number; y: number } | undefined>()

  const currentWorld: WorldData = WORLDS_DATA.find((w) => w.id === selectedWorldId) || WORLDS_DATA[0]
  const currentLevel: LevelData = currentWorld.levels.find((l) => l.id === selectedLevelId) || currentWorld.levels[0]

  // Synchronize audio engine settings
  useEffect(() => {
    soundEngine.setSfxEnabled(gameState.settings.sfxVolume)
    soundEngine.setSpeechRate(gameState.settings.speechSpeed)
  }, [gameState.settings])

  // Reset & Initialize game level
  const initLevel = useCallback((level: LevelData) => {
    setPoppedBubbleIds([])
    setShowCelebration(false)
    setWobbleId(null)
    setSelectedWordOptionId(null)

    // World 2 & 4 Word Setup
    if (level.targetWord) {
      setPlacedLetters(new Array(level.targetWord.length).fill(null))
      const letters = (level.scrambledLetters || level.targetWord.split('')).map((char, index) => ({
        id: `${char}-${index}`,
        char,
        used: false,
      }))
      setAvailableLetters(letters)
    }

    // World 4: Automatic audio pronunciation
    if (level.worldId === 4 && level.phoneticAudioPrompt) {
      setTimeout(() => {
        soundEngine.speakWord(level.phoneticAudioPrompt!)
      }, 300)
    }
  }, [])

  useEffect(() => {
    if (view === 'playing') {
      initLevel(currentLevel)
    }
  }, [view, selectedWorldId, selectedLevelId, currentLevel, initLevel])

  // Trigger splash burst effect
  const triggerSplash = (e?: React.MouseEvent | React.TouchEvent, customX?: number, customY?: number) => {
    soundEngine.playSplash()
    if (customX !== undefined && customY !== undefined) {
      setParticleOrigin({ x: customX, y: customY })
    } else if (e && 'clientX' in e) {
      const rect = e.currentTarget.getBoundingClientRect()
      setParticleOrigin({ x: e.clientX, y: e.clientY })
    }
    setParticleTrigger((prev) => prev + 1)
  }

  // Handle Level Completion
  const handleLevelVictory = (accuracy: number = 100) => {
    soundEngine.playCorrect()
    soundEngine.playFanfare()

    // Calculate stars: 90%+ = 3 stars, 70%+ = 2 stars, completed = 1 star
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1
    setLevelStars(stars)
    setLevelAccuracy(accuracy)
    setShowCelebration(true)

    // Update game state
    const levelKey = `${selectedWorldId}-${selectedLevelId}`
    const existing = gameState.progress[levelKey]
    const updatedStars = Math.max(existing?.stars || 0, stars)
    const attempts = (existing?.attempts || 0) + 1

    const skillKey = currentLevel.focusSkill
    const currentSkill = gameState.skillStats[skillKey]

    const nextState: GameState = {
      ...gameState,
      progress: {
        ...gameState.progress,
        [levelKey]: {
          levelId: selectedLevelId,
          worldId: selectedWorldId,
          completed: true,
          stars: updatedStars,
          bestScore: Math.max(existing?.bestScore || 0, Math.round(accuracy * 10)),
          accuracy,
          attempts,
          completedAt: new Date().toISOString(),
        },
      },
      skillStats: {
        ...gameState.skillStats,
        [skillKey]: {
          correct: currentSkill.correct + 1,
          total: currentSkill.total + 1,
        },
      },
    }

    setGameState(nextState)
    saveGameState(nextState)
  }

  // --- World 1: Bubble Tap ---
  const handleBubbleClick = (bubble: { id: string; char: string; isTarget: boolean }, e: React.MouseEvent) => {
    if (poppedBubbleIds.includes(bubble.id)) return

    if (bubble.isTarget) {
      triggerSplash(e)
      soundEngine.playBubblePop()
      const nextPopped = [...poppedBubbleIds, bubble.id]
      setPoppedBubbleIds(nextPopped)

      // Check if all target bubbles popped
      const allTargets = currentLevel.bubbles?.filter((b) => b.isTarget) || []
      if (nextPopped.length >= allTargets.length) {
        setTimeout(() => {
          handleLevelVictory(100)
        }, 300)
      }
    } else {
      soundEngine.playTryAgain()
      setWobbleId(bubble.id)
      setTimeout(() => setWobbleId(null), 500)
    }
  }

  // --- World 2 & 4: Word Builder Placement ---
  const handleTileClick = (tile: { id: string; char: string; used: boolean }, e: React.MouseEvent) => {
    if (tile.used) return
    triggerSplash(e)
    soundEngine.playBubblePop()

    // Find first empty slot
    const emptyIndex = placedLetters.findIndex((l) => l === null)
    if (emptyIndex === -1) return

    const nextPlaced = [...placedLetters]
    nextPlaced[emptyIndex] = tile.char
    setPlacedLetters(nextPlaced)

    // Mark tile as used
    setAvailableLetters((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t))
    )

    // Check if word is complete
    if (!nextPlaced.includes(null) && currentLevel.targetWord) {
      const builtWord = nextPlaced.join('')
      if (builtWord.toUpperCase() === currentLevel.targetWord.toUpperCase()) {
        setTimeout(() => {
          handleLevelVictory(100)
        }, 350)
      } else {
        // Try again without punishment
        soundEngine.playTryAgain()
        setTimeout(() => {
          setPlacedLetters(new Array(currentLevel.targetWord!.length).fill(null))
          setAvailableLetters((prev) => prev.map((t) => ({ ...t, used: false })))
        }, 600)
      }
    }
  }

  // Remove letter from slot
  const handleSlotClick = (slotIndex: number) => {
    const char = placedLetters[slotIndex]
    if (!char) return

    soundEngine.playBubblePop()
    const nextPlaced = [...placedLetters]
    nextPlaced[slotIndex] = null
    setPlacedLetters(nextPlaced)

    // Make corresponding letter available again
    setAvailableLetters((prev) => {
      let restored = false
      return prev.map((t) => {
        if (!restored && t.char === char && t.used) {
          restored = true
          return { ...t, used: false }
        }
        return t
      })
    })
  }

  // --- World 5: Spelling Choice Tap ---
  const handleOptionClick = (option: { id: string; text: string; isCorrect: boolean }, e: React.MouseEvent) => {
    setSelectedWordOptionId(option.id)

    if (option.isCorrect) {
      triggerSplash(e)
      setTimeout(() => {
        handleLevelVictory(100)
      }, 400)
    } else {
      soundEngine.playTryAgain()
      setWobbleId(option.id)
      setTimeout(() => setWobbleId(null), 500)
    }
  }

  // Next level navigation
  const handleNextLevel = () => {
    setShowCelebration(false)
    if (selectedLevelId < 10) {
      setSelectedLevelId((prev) => prev + 1)
    } else if (selectedWorldId < 5) {
      setSelectedWorldId((prev) => prev + 1)
      setSelectedLevelId(1)
    } else {
      setView('map')
    }
  }

  // Accessibility Style Classes
  const fontClass = gameState.settings.fontFamily === 'dyslexic' ? 'ws-font-dyslexic' : ''
  const spacingClass = `ws-spacing-${gameState.settings.letterSpacing}`
  const sizeClass = `ws-size-${gameState.settings.fontSize}`
  const contrastClass = gameState.settings.highContrast ? 'ws-high-contrast' : ''

  return (
    <div className={`wordsplash-app ${fontClass} ${spacingClass} ${sizeClass} ${contrastClass}`}>
      <SplashParticles
        triggerKey={particleTrigger}
        x={particleOrigin?.x}
        y={particleOrigin?.y}
        color={currentWorld.themeColor}
      />

      {/* VIEW: WORLD MAP */}
      {view === 'map' && (
        <WorldMap
          gameState={gameState}
          onSelectWorld={(wId) => {
            setSelectedWorldId(wId)
            setView('level-select')
          }}
          onOpenSettings={() => setShowSettings(true)}
          onBackToApp={onBackToApp}
        />
      )}

      {/* VIEW: LEVEL SELECT */}
      {view === 'level-select' && (
        <LevelSelect
          world={currentWorld}
          gameState={gameState}
          onSelectLevel={(lId) => {
            setSelectedLevelId(lId)
            setView('playing')
          }}
          onBackToMap={() => setView('map')}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* VIEW: GAME PLAYING ARENA */}
      {view === 'playing' && (
        <div className="ws-arena screen" style={{ background: currentWorld.bgGradient }}>
          {/* Arena Header */}
          <div className="ws-arena-header">
            <button className="ws-arena-back" onClick={() => setView('level-select')} aria-label="Back">
              ←
            </button>
            <div className="ws-arena-level-pill">
              <span className="ws-pill-world">W{selectedWorldId}</span>
              <span className="ws-pill-dot">•</span>
              <span className="ws-pill-level">Level {selectedLevelId}</span>
            </div>
            <div className="ws-arena-actions">
              <button
                className="ws-audio-btn"
                onClick={() => {
                  if (currentLevel.phoneticAudioPrompt) {
                    soundEngine.speakWord(currentLevel.phoneticAudioPrompt)
                  } else if (currentLevel.targetLetter) {
                    soundEngine.speakWord(`Find the letter ${currentLevel.targetLetter}`)
                  } else {
                    soundEngine.speakWord(currentLevel.instruction)
                  }
                }}
                aria-label="Read Prompt"
              >
                🔊
              </button>
              <button className="ws-settings-btn" onClick={() => setShowSettings(true)} aria-label="Accessibility">
                ♿
              </button>
            </div>
          </div>

          <div className="screen-scroll ws-arena-scroll">
            {/* Level Prompt Card */}
            <div className="ws-prompt-card">
              <h2 className="ws-prompt-title">{currentLevel.title}</h2>
              <p className="ws-prompt-instruction">{currentLevel.instruction}</p>
              {currentLevel.targetHint && (
                <div className="ws-hint-chip">
                  <span>💡</span> {currentLevel.targetHint}
                </div>
              )}
            </div>

            {/* WORLD 1: LETTER SPLASH BUBBLES */}
            {selectedWorldId === 1 && currentLevel.bubbles && (
              <div className="ws-bubble-arena">
                <div className="ws-bubble-grid">
                  {currentLevel.bubbles.map((b) => {
                    const isPopped = poppedBubbleIds.includes(b.id)
                    const isWobbling = wobbleId === b.id

                    return (
                      <button
                        key={b.id}
                        className={`ws-letter-bubble ${isPopped ? 'ws-bubble--popped' : ''} ${
                          isWobbling ? 'ws-bubble--wobble' : ''
                        }`}
                        onClick={(e) => handleBubbleClick(b, e)}
                        disabled={isPopped}
                      >
                        <span className="ws-bubble-letter">{b.char}</span>
                        <div className="ws-bubble-glint" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* WORLD 2 & 4: WORD BUILDER & LISTEN & BUILD */}
            {(selectedWorldId === 2 || selectedWorldId === 4) && currentLevel.targetWord && (
              <div className="ws-wordbuilder-arena">
                {/* Visual image/emoji */}
                {currentLevel.imageEmoji && (
                  <div className="ws-word-emoji-badge">
                    <span>{currentLevel.imageEmoji}</span>
                    {currentLevel.wordMeaning && (
                      <span className="ws-word-meaning">{currentLevel.wordMeaning}</span>
                    )}
                  </div>
                )}

                {/* World 4 Audio Prompt button */}
                {selectedWorldId === 4 && (
                  <button
                    className="ws-listen-repeat-btn"
                    onClick={() => soundEngine.speakWord(currentLevel.phoneticAudioPrompt || currentLevel.targetWord!)}
                  >
                    🔊 Hear Word: "{currentLevel.phoneticAudioPrompt || currentLevel.targetWord}"
                  </button>
                )}

                {/* Word Construction Slots */}
                <div className="ws-word-slots">
                  {placedLetters.map((letter, idx) => (
                    <button
                      key={idx}
                      className={`ws-slot-box ${letter ? 'ws-slot-box--filled' : ''}`}
                      onClick={() => handleSlotClick(idx)}
                    >
                      {letter || ''}
                    </button>
                  ))}
                </div>

                <p className="ws-builder-subtext">Tap letters below in order to fill slots</p>

                {/* Available letter tiles */}
                <div className="ws-tiles-palette">
                  {availableLetters.map((tile) => (
                    <button
                      key={tile.id}
                      className={`ws-letter-tile ${tile.used ? 'ws-letter-tile--used' : ''}`}
                      onClick={(e) => handleTileClick(tile, e)}
                      disabled={tile.used}
                    >
                      {tile.char}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WORLD 3: TRACE & SPLASH CANVAS */}
            {selectedWorldId === 3 && currentLevel.tracePaths && (
              <TraceCanvas
                traceCharacter={currentLevel.traceCharacter || 'A'}
                tracePaths={currentLevel.tracePaths}
                guideLevel={currentLevel.guideLevel || 'full'}
                onComplete={(accuracy) => handleLevelVictory(accuracy)}
                onSplashBurst={(x, y) => triggerSplash(undefined, x, y)}
              />
            )}

            {/* WORLD 5: WORD SPLASH SPELLING CHOICES */}
            {selectedWorldId === 5 && currentLevel.wordOptions && (
              <div className="ws-spelling-arena">
                <div className="ws-spelling-list">
                  {currentLevel.wordOptions.map((opt) => {
                    const isSelected = selectedWordOptionId === opt.id
                    const isWobble = wobbleId === opt.id

                    return (
                      <button
                        key={opt.id}
                        className={`ws-spelling-bubble ${isSelected && opt.isCorrect ? 'ws-spelling--correct' : ''} ${
                          isWobble ? 'ws-bubble--wobble' : ''
                        }`}
                        onClick={(e) => handleOptionClick(opt, e)}
                      >
                        <span className="ws-spelling-text">{opt.text}</span>
                        {isSelected && opt.isCorrect && <span className="ws-check-mark">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ height: 24 }} />
          </div>

          {/* LEVEL CELEBRATION MODAL */}
          {showCelebration && (
            <div className="ws-celebration-overlay">
              <div className="ws-celebration-card">
                <div className="ws-celeb-badge">💦 SPLASH!</div>
                <h2 className="ws-celeb-title">Level Complete!</h2>
                <p className="ws-celeb-sub">{currentLevel.title}</p>

                {/* Stars Animation */}
                <div className="ws-celeb-stars">
                  {[1, 2, 3].map((s) => (
                    <span
                      key={s}
                      className={`ws-celeb-star ${s <= levelStars ? 'ws-celeb-star--awarded' : ''}`}
                      style={{ animationDelay: `${s * 0.15}s` }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <div className="ws-celeb-stats">
                  <span className="ws-celeb-stat">Accuracy: <strong>{levelAccuracy}%</strong></span>
                  <span className="ws-celeb-stat">Stars: <strong>{levelStars} / 3</strong></span>
                </div>

                <div className="ws-celeb-actions">
                  <button className="ws-celeb-btn ws-celeb-btn--primary" onClick={handleNextLevel}>
                    Next Level ➔
                  </button>
                  <button
                    className="ws-celeb-btn ws-celeb-btn--secondary"
                    onClick={() => initLevel(currentLevel)}
                  >
                    ↺ Play Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACCESSIBILITY DRAWER */}
      {showSettings && (
        <AccessibilityModal
          settings={gameState.settings}
          onUpdate={(newSettings: AccessibilitySettings) => {
            const next = { ...gameState, settings: newSettings }
            setGameState(next)
            saveGameState(next)
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
