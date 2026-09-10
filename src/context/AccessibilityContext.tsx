import React, { createContext, useContext, useState, useEffect } from 'react'
import { soundEngine } from '../utils/soundEngine'

export type FontSizeOption = 'normal' | 'large' | 'xlarge'
export type LayoutMode = 'auto' | 'phone' | 'desktop'

export interface AccessibilitySettings {
  calmMode: boolean
  reducedMotion: boolean
  dyslexicFont: boolean
  fontSize: FontSizeOption
  highContrast: boolean
  textSpacing: boolean
  sfxEnabled: boolean
  sfxVolume: number
  ttsEnabled: boolean
  ttsRate: number
  ttsPitch: number
  layoutMode: LayoutMode
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  calmMode: false,
  reducedMotion: false,
  dyslexicFont: false,
  fontSize: 'normal',
  highContrast: false,
  textSpacing: false,
  sfxEnabled: true,
  sfxVolume: 0.7,
  ttsEnabled: true,
  ttsRate: 0.9,
  ttsPitch: 1.05,
  layoutMode: 'auto',
}

const STORAGE_KEY = 'snk_accessibility_settings'

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void
  resetSettings: () => void
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  toggleModal: () => void
  activeLayout: 'phone' | 'desktop'
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sync with sound engine
  useEffect(() => {
    soundEngine.setSfxEnabled(settings.sfxEnabled)
    soundEngine.setSfxVolume(settings.sfxVolume)
    soundEngine.setVoiceEnabled(settings.ttsEnabled)
    soundEngine.setSpeechRate(settings.ttsRate)
    soundEngine.setSpeechPitch(settings.ttsPitch)
  }, [
    settings.sfxEnabled,
    settings.sfxVolume,
    settings.ttsEnabled,
    settings.ttsRate,
    settings.ttsPitch,
  ])

  // Sync root DOM attributes for styling
  useEffect(() => {
    const root = document.documentElement
    if (settings.calmMode) root.setAttribute('data-theme', 'calm')
    else root.removeAttribute('data-theme')

    if (settings.dyslexicFont) root.setAttribute('data-font', 'dyslexic')
    else root.removeAttribute('data-font')

    if (settings.reducedMotion) root.setAttribute('data-motion', 'reduced')
    else root.removeAttribute('data-motion')

    if (settings.highContrast) root.setAttribute('data-contrast', 'high')
    else root.removeAttribute('data-contrast')

    if (settings.textSpacing) root.setAttribute('data-spacing', 'wide')
    else root.removeAttribute('data-spacing')

    root.setAttribute('data-fontsize', settings.fontSize)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // ignore
    }
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const toggleModal = () => setIsModalOpen((prev) => !prev)

  // Compute active layout
  const activeLayout: 'phone' | 'desktop' =
    settings.layoutMode === 'phone'
      ? 'phone'
      : settings.layoutMode === 'desktop'
      ? 'desktop'
      : windowWidth >= 768
      ? 'desktop'
      : 'phone'

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        isModalOpen,
        openModal,
        closeModal,
        toggleModal,
        activeLayout,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
