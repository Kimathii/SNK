import { GameState, getCompletedLevelsCount, isWorldUnlocked, getAdaptiveRecommendation } from '../gameState'
import { WORLDS_DATA, WorldData } from '../gameData'
import './WorldMap.css'

interface Props {
  gameState: GameState
  onSelectWorld: (worldId: number) => void
  onOpenSettings: () => void
  onBackToApp: () => void
}

export default function WorldMap({
  gameState,
  onSelectWorld,
  onOpenSettings,
  onBackToApp,
}: Props) {
  const adaptiveTip = getAdaptiveRecommendation(gameState.skillStats)

  // Calculate total stars collected
  let totalStars = 0
  Object.values(gameState.progress).forEach((p) => {
    totalStars += p.stars || 0
  })

  return (
    <div className="wm-screen screen">
      {/* Header */}
      <div className="wm-header">
        <button className="wm-back-btn" onClick={onBackToApp} aria-label="Back">
          ←
        </button>
        <div className="wm-title-block">
          <h1 className="wm-game-title">WordSplash</h1>
          <span className="wm-game-sub">5 Worlds • 50 Levels</span>
        </div>
        <div className="wm-header-actions">
          <div className="wm-stars-chip">
            <span>⭐</span>
            <strong>{totalStars}</strong>
          </div>
          <button className="wm-settings-btn" onClick={onOpenSettings} aria-label="Accessibility">
            ♿
          </button>
        </div>
      </div>

      <div className="screen-scroll wm-scroll">
        {/* Adaptive Coach Banner */}
        <div className="wm-coach-banner">
          <div className="wm-coach-icon">🐬</div>
          <div className="wm-coach-content">
            <span className="wm-coach-title">{adaptiveTip.text}</span>
            <span className="wm-coach-sub">{adaptiveTip.subtext}</span>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="wm-demo-badge">
          <span>✨ Demo Mode: All 5 Worlds & 50 Levels Unlocked</span>
        </div>

        {/* World List */}
        <div className="wm-world-list">
          {WORLDS_DATA.map((world: WorldData) => {
            const unlocked = isWorldUnlocked(world.id, gameState)
            const completedCount = getCompletedLevelsCount(world.id, gameState)

            // Calculate stars in this world
            let worldStars = 0
            for (let l = 1; l <= 10; l++) {
              worldStars += gameState.progress[`${world.id}-${l}`]?.stars || 0
            }

            return (
              <div
                key={world.id}
                className={`wm-world-card ${unlocked ? 'wm-world-card--unlocked' : 'wm-world-card--locked'}`}
                style={{ background: world.bgGradient }}
                onClick={() => unlocked && onSelectWorld(world.id)}
              >
                <div className="wm-world-top">
                  <div className="wm-world-icon-wrap" style={{ borderColor: world.themeColor }}>
                    <span className="wm-world-emoji">{world.iconEmoji}</span>
                  </div>
                  <div className="wm-world-header-info">
                    <span className="wm-world-num" style={{ color: world.themeColor }}>
                      WORLD {world.id}
                    </span>
                    <h2 className="wm-world-name">{world.title}</h2>
                    <span className="wm-world-sub">{world.subtitle}</span>
                  </div>
                  <div className="wm-world-status">
                    {unlocked ? (
                      <span className="wm-unlocked-chip">▶ Play</span>
                    ) : (
                      <span className="wm-locked-chip">🔒 Locked</span>
                    )}
                  </div>
                </div>

                <p className="wm-world-desc">{world.focusDescription}</p>

                {/* Progress bar */}
                <div className="wm-world-footer">
                  <div className="wm-progress-bar-wrap">
                    <div className="wm-progress-labels">
                      <span className="wm-progress-text">{completedCount} / 10 Levels Done</span>
                      <span className="wm-progress-stars">⭐ {worldStars}/30</span>
                    </div>
                    <div className="wm-progress-track">
                      <div
                        className="wm-progress-fill"
                        style={{
                          width: `${(completedCount / 10) * 100}%`,
                          backgroundColor: world.themeColor,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}
