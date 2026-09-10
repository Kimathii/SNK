import { useAccessibility } from '../context/AccessibilityContext'
import { soundEngine } from '../utils/soundEngine'
import './AccessibilityModal.css'

export default function AccessibilityModal() {
  const { isModalOpen, closeModal, settings, updateSetting, resetSettings } =
    useAccessibility()

  if (!isModalOpen) return null

  const handleTestChime = () => {
    soundEngine.playCorrect()
  }

  const handleTestSpeech = () => {
    soundEngine.speak('Welcome to S N K! Sensory friendly learning made for you.')
  }

  return (
    <div className="a11y-overlay" onClick={closeModal}>
      <div
        className="a11y-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility & Sensory Controls"
      >
        <div className="a11y-header">
          <div className="a11y-title-wrap">
            <span className="a11y-header-icon">♿</span>
            <div>
              <h2 className="a11y-title">Accessibility & Sensory</h2>
              <p className="a11y-subtitle">Customize your visual and sound experience</p>
            </div>
          </div>
          <button className="a11y-close-btn" onClick={closeModal} aria-label="Close settings">
            ✕
          </button>
        </div>

        <div className="a11y-body">
          {/* SENSORY / CALM CONTROLS */}
          <div className="a11y-section">
            <span className="a11y-section-title">🌿 Sensory & Focus Modes</span>

            <div className="a11y-item">
              <div className="a11y-item-info">
                <span className="a11y-item-label">Calm Theme Mode</span>
                <span className="a11y-item-desc">
                  Soft, muted colors to reduce visual overload and eye strain
                </span>
              </div>
              <label className="a11y-switch">
                <input
                  type="checkbox"
                  checked={settings.calmMode}
                  onChange={(e) => updateSetting('calmMode', e.target.checked)}
                />
                <span className="a11y-slider"></span>
              </label>
            </div>

            <div className="a11y-item">
              <div className="a11y-item-info">
                <span className="a11y-item-label">Reduce Motion</span>
                <span className="a11y-item-desc">
                  Stops bouncing, floating, and fast screen animations
                </span>
              </div>
              <label className="a11y-switch">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                />
                <span className="a11y-slider"></span>
              </label>
            </div>

            <div className="a11y-item">
              <div className="a11y-item-info">
                <span className="a11y-item-label">High Contrast</span>
                <span className="a11y-item-desc">
                  Sharper text borders and increased element separation
                </span>
              </div>
              <label className="a11y-switch">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                />
                <span className="a11y-slider"></span>
              </label>
            </div>
          </div>

          {/* READING & DYSLEXIA */}
          <div className="a11y-section">
            <span className="a11y-section-title">📖 Reading & Typography</span>

            <div className="a11y-item">
              <div className="a11y-item-info">
                <span className="a11y-item-label">OpenDyslexic Font</span>
                <span className="a11y-item-desc">
                  Specially weighted characters to prevent letter confusion
                </span>
              </div>
              <label className="a11y-switch">
                <input
                  type="checkbox"
                  checked={settings.dyslexicFont}
                  onChange={(e) => updateSetting('dyslexicFont', e.target.checked)}
                />
                <span className="a11y-slider"></span>
              </label>
            </div>

            <div className="a11y-item">
              <div className="a11y-item-info">
                <span className="a11y-item-label">Wide Letter Spacing</span>
                <span className="a11y-item-desc">Extra breath between words and letters</span>
              </div>
              <label className="a11y-switch">
                <input
                  type="checkbox"
                  checked={settings.textSpacing}
                  onChange={(e) => updateSetting('textSpacing', e.target.checked)}
                />
                <span className="a11y-slider"></span>
              </label>
            </div>

            <div className="a11y-item-col">
              <span className="a11y-item-label">Font Size Scale</span>
              <div className="a11y-button-group">
                {(['normal', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`a11y-btn-option ${
                      settings.fontSize === size ? 'a11y-btn-option--active' : ''
                    }`}
                    onClick={() => updateSetting('fontSize', size)}
                  >
                    {size === 'normal' ? 'Normal (100%)' : size === 'large' ? 'Large (115%)' : 'Extra Large (130%)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AUDIO & TEXT-TO-SPEECH */}
          <div className="a11y-section">
            <span className="a11y-section-title">🔊 Audio & Voice Guidance</span>

            <div className="a11y-item">
              <div className="a11y-item-info">
                <span className="a11y-item-label">Text-to-Speech (TTS)</span>
                <span className="a11y-item-desc">Enables speaker buttons to read text aloud</span>
              </div>
              <label className="a11y-switch">
                <input
                  type="checkbox"
                  checked={settings.ttsEnabled}
                  onChange={(e) => updateSetting('ttsEnabled', e.target.checked)}
                />
                <span className="a11y-slider"></span>
              </label>
            </div>

            {settings.ttsEnabled && (
              <>
                <div className="a11y-range-item">
                  <div className="a11y-range-label-row">
                    <span>Speech Speed</span>
                    <span className="a11y-range-val">{settings.ttsRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.3"
                    step="0.1"
                    value={settings.ttsRate}
                    onChange={(e) => updateSetting('ttsRate', parseFloat(e.target.value))}
                    className="a11y-slider-input"
                  />
                  <div className="a11y-range-meta">
                    <span>Slower (0.5x)</span>
                    <span>Faster (1.3x)</span>
                  </div>
                </div>

                <div className="a11y-test-row">
                  <button type="button" className="a11y-action-btn" onClick={handleTestSpeech}>
                    🗣️ Test Voice Pronunciation
                  </button>
                </div>
              </>
            )}

            <div className="a11y-item">
              <div className="a11y-item-info">
                <span className="a11y-item-label">Sound Effects (SFX)</span>
                <span className="a11y-item-desc">Gentle chimes, taps, and praise tones</span>
              </div>
              <label className="a11y-switch">
                <input
                  type="checkbox"
                  checked={settings.sfxEnabled}
                  onChange={(e) => updateSetting('sfxEnabled', e.target.checked)}
                />
                <span className="a11y-slider"></span>
              </label>
            </div>

            {settings.sfxEnabled && (
              <div className="a11y-test-row">
                <button type="button" className="a11y-action-btn" onClick={handleTestChime}>
                  🔔 Test Chime Sound
                </button>
              </div>
            )}
          </div>

          {/* VIEWPORT & LAYOUT */}
          <div className="a11y-section">
            <span className="a11y-section-title">📱 App & Web Layout</span>
            <div className="a11y-item-col">
              <span className="a11y-item-label">Display Mode</span>
              <div className="a11y-button-group">
                {(['auto', 'phone', 'desktop'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`a11y-btn-option ${
                      settings.layoutMode === mode ? 'a11y-btn-option--active' : ''
                    }`}
                    onClick={() => updateSetting('layoutMode', mode)}
                  >
                    {mode === 'auto'
                      ? '⚡ Auto-Detect'
                      : mode === 'phone'
                      ? '📱 Phone Shell'
                      : '💻 Full Desktop Web'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="a11y-footer">
          <button type="button" className="a11y-reset-btn" onClick={resetSettings}>
            Reset Defaults
          </button>
          <button type="button" className="a11y-done-btn" onClick={closeModal}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
