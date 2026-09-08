import { AccessibilitySettings } from '../gameState'
import './AccessibilityModal.css'

interface Props {
  settings: AccessibilitySettings
  onUpdate: (newSettings: AccessibilitySettings) => void
  onClose: () => void
}

export default function AccessibilityModal({ settings, onUpdate, onClose }: Props) {
  const update = <K extends keyof AccessibilitySettings>(key: K, val: AccessibilitySettings[K]) => {
    onUpdate({ ...settings, [key]: val })
  }

  return (
    <div className="ws-modal-overlay" onClick={onClose}>
      <div className="ws-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="ws-modal-header">
          <div className="ws-modal-title-row">
            <span className="ws-modal-icon">♿</span>
            <h2 className="ws-modal-title">Accessibility & Comfort</h2>
          </div>
          <button className="ws-modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="ws-modal-desc">
          Customize typography, spacing, contrast, and voice assistance for the most comfortable learning experience.
        </p>

        <div className="ws-settings-list">
          {/* Font Type */}
          <div className="ws-setting-item">
            <div className="ws-setting-label-block">
              <span className="ws-setting-label">Font Style</span>
              <span className="ws-setting-hint">OpenDyslexic style weighted bottom</span>
            </div>
            <div className="ws-segmented-control">
              <button
                className={`ws-seg-btn ${settings.fontFamily === 'standard' ? 'ws-seg-btn--active' : ''}`}
                onClick={() => update('fontFamily', 'standard')}
              >
                Standard
              </button>
              <button
                className={`ws-seg-btn ${settings.fontFamily === 'dyslexic' ? 'ws-seg-btn--active' : ''}`}
                onClick={() => update('fontFamily', 'dyslexic')}
              >
                Dyslexia Friendly
              </button>
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="ws-setting-item">
            <div className="ws-setting-label-block">
              <span className="ws-setting-label">Letter Spacing</span>
              <span className="ws-setting-hint">Increases room between characters</span>
            </div>
            <div className="ws-segmented-control">
              <button
                className={`ws-seg-btn ${settings.letterSpacing === 'normal' ? 'ws-seg-btn--active' : ''}`}
                onClick={() => update('letterSpacing', 'normal')}
              >
                Normal
              </button>
              <button
                className={`ws-seg-btn ${settings.letterSpacing === 'wide' ? 'ws-seg-btn--active' : ''}`}
                onClick={() => update('letterSpacing', 'wide')}
              >
                Wide
              </button>
              <button
                className={`ws-seg-btn ${settings.letterSpacing === 'extra-wide' ? 'ws-seg-btn--active' : ''}`}
                onClick={() => update('letterSpacing', 'extra-wide')}
              >
                Extra
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="ws-setting-item">
            <div className="ws-setting-label-block">
              <span className="ws-setting-label">Text Size</span>
              <span className="ws-setting-hint">Scale prompt and letter size</span>
            </div>
            <div className="ws-segmented-control">
              <button
                className={`ws-seg-btn ${settings.fontSize === 'normal' ? 'ws-seg-btn--active' : ''}`}
                onClick={() => update('fontSize', 'normal')}
              >
                Default
              </button>
              <button
                className={`ws-seg-btn ${settings.fontSize === 'large' ? 'ws-seg-btn--active' : ''}`}
                onClick={() => update('fontSize', 'large')}
              >
                Large
              </button>
              <button
                className={`ws-seg-btn ${settings.fontSize === 'xlarge' ? 'ws-seg-btn--active' : ''}`}
                onClick={() => update('fontSize', 'xlarge')}
              >
                Extra
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="ws-setting-item ws-setting-item--row">
            <div className="ws-setting-label-block">
              <span className="ws-setting-label">High Contrast Mode</span>
              <span className="ws-setting-hint">Deep dark borders with maximum readability</span>
            </div>
            <label className="ws-toggle">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => update('highContrast', e.target.checked)}
              />
              <span className="ws-toggle-slider" />
            </label>
          </div>

          {/* Sound Effects */}
          <div className="ws-setting-item ws-setting-item--row">
            <div className="ws-setting-label-block">
              <span className="ws-setting-label">Water & Chime Sounds</span>
              <span className="ws-setting-hint">Interactive splash and reward audio</span>
            </div>
            <label className="ws-toggle">
              <input
                type="checkbox"
                checked={settings.sfxVolume}
                onChange={(e) => update('sfxVolume', e.target.checked)}
              />
              <span className="ws-toggle-slider" />
            </label>
          </div>

          {/* Speech Rate */}
          <div className="ws-setting-item">
            <div className="ws-setting-label-block">
              <span className="ws-setting-label">Speech Pronunciation Pace</span>
              <span className="ws-setting-hint">
                {settings.speechSpeed < 0.8 ? 'Slow & Deliberate' : settings.speechSpeed < 1.0 ? 'Comfortable' : 'Standard'}
              </span>
            </div>
            <div className="ws-slider-row">
              <span className="ws-slider-icon">🐢</span>
              <input
                type="range"
                min="0.6"
                max="1.1"
                step="0.05"
                value={settings.speechSpeed}
                onChange={(e) => update('speechSpeed', parseFloat(e.target.value))}
                className="ws-slider"
              />
              <span className="ws-slider-icon">🐇</span>
            </div>
          </div>
        </div>

        <div className="ws-modal-footer">
          <button className="ws-modal-done-btn" onClick={onClose}>
            ✓ Save & Play
          </button>
        </div>
      </div>
    </div>
  )
}
