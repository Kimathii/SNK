import { GameState, isLevelUnlocked } from '../gameState'
import { WorldData } from '../gameData'
import './LevelSelect.css'

interface Props {
  world: WorldData
  gameState: GameState
  onSelectLevel: (levelId: number) => void
  onBackToMap: () => void
  onOpenSettings: () => void
}

export default function LevelSelect({
  world,
  gameState,
  onSelectLevel,
  onBackToMap,
  onOpenSettings,
}: Props) {
  // Find first uncompleted level as recommended
  let recommendedLevelId = 1
  for (let l = 1; l <= 10; l++) {
    if (!gameState.progress[`${world.id}-${l}`]?.completed) {
      recommendedLevelId = l
      break
    }
  }

  return (
    <div className="ls-screen screen" style={{ background: world.bgGradient }}>
      {/* Header */}
      <div className="ls-header">
        <button className="ls-back-btn" onClick={onBackToMap} aria-label="Back to Map">
          ←
        </button>
        <div className="ls-title-block">
          <span className="ls-world-tag" style={{ color: world.themeColor }}>
            WORLD {world.id}
          </span>
          <h1 className="ls-world-name">{world.title}</h1>
        </div>
        <button className="ls-settings-btn" onClick={onOpenSettings} aria-label="Accessibility">
          ♿
        </button>
      </div>

      <div className="screen-scroll ls-scroll">
        {/* World Banner */}
        <div className="ls-banner">
          <span className="ls-banner-emoji">{world.iconEmoji}</span>
          <div className="ls-banner-text">
            <h2>{world.subtitle}</h2>
            <p>{world.focusDescription}</p>
          </div>
        </div>

        {/* 10 Level Cards */}
        <div className="ls-level-grid">
          {world.levels.map((level) => {
            const progress = gameState.progress[`${world.id}-${level.id}`]
            const isCompleted = !!progress?.completed
            const stars = progress?.stars || 0
            const isUnlocked = isLevelUnlocked(world.id, level.id, gameState)
            const isRecommended = level.id === recommendedLevelId

            return (
              <div
                key={level.id}
                className={`ls-level-card ${isCompleted ? 'ls-level-card--completed' : ''} ${
                  isRecommended ? 'ls-level-card--recommended' : ''
                } ${!isUnlocked ? 'ls-level-card--locked' : ''}`}
                onClick={() => isUnlocked && onSelectLevel(level.id)}
              >
                {isRecommended && <span className="ls-rec-badge">Play Next</span>}

                <div className="ls-level-top">
                  <div className="ls-level-badge" style={{ background: world.themeColor }}>
                    {level.id < 10 ? `0${level.id}` : level.id}
                  </div>
                  <div className="ls-level-info">
                    <span className="ls-level-title">{level.title}</span>
                    <span className="ls-level-inst">{level.instruction}</span>
                  </div>
                </div>

                <div className="ls-level-footer">
                  <div className="ls-stars-row">
                    {[1, 2, 3].map((starNum) => (
                      <span
                        key={starNum}
                        className={`ls-star ${starNum <= stars ? 'ls-star--earned' : 'ls-star--empty'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {isCompleted ? (
                    <span className="ls-completed-tag">✓ Done ({progress?.accuracy || 100}%)</span>
                  ) : (
                    <span className="ls-play-tag">▶ Play</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
