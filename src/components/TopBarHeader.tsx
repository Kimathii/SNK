import React from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import SpeakButton from './SpeakButton'
import './TopBarHeader.css'

interface Props {
  title?: string
  speechText?: string
  onBack?: () => void
  showBack?: boolean
  rightElement?: React.ReactNode
  className?: string
}

export default function TopBarHeader({
  title,
  speechText,
  onBack,
  showBack = false,
  rightElement,
  className = '',
}: Props) {
  const { toggleModal, activeLayout, canUseDesktopLayout, updateSetting } = useAccessibility()

  const handleToggleLayout = () => {
    updateSetting('layoutMode', activeLayout === 'phone' ? 'desktop' : 'phone')
  }

  return (
    <header className={`topbar-header ${className}`}>
      <div className="topbar-left">
        {showBack && onBack && (
          <button
            type="button"
            className="topbar-btn topbar-back-btn"
            onClick={onBack}
            aria-label="Go back"
          >
            ←
          </button>
        )}
        {title && <h1 className="topbar-title">{title}</h1>}
        {speechText && <SpeakButton text={speechText} size="sm" />}
      </div>

      <div className="topbar-right">
        {rightElement}

        {/* Layout Toggle Button */}
        <button
          type="button"
          className="topbar-btn topbar-layout-btn"
          onClick={handleToggleLayout}
          title={canUseDesktopLayout ? `Switch to ${activeLayout === 'phone' ? 'desktop' : 'mobile'} layout` : 'Desktop layout is available on wider screens'}
          aria-label={`Switch layout mode`}
          aria-pressed={activeLayout === 'phone'}
          disabled={!canUseDesktopLayout}
        >
          {activeLayout === 'phone' ? '💻' : '📱'}
        </button>

        {/* Accessibility Modal Toggle Button */}
        <button
          type="button"
          className="topbar-btn topbar-a11y-btn"
          onClick={toggleModal}
          title="Open Accessibility & Sensory Settings"
          aria-label="Open Accessibility & Sensory Settings"
        >
          ♿
        </button>
      </div>
    </header>
  )
}
