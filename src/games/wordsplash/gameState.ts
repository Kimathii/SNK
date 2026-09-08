// Game State & Persistence for WordSplash

export interface LevelProgress {
  levelId: number
  worldId: number
  completed: boolean
  stars: number // 0-3
  bestScore: number
  accuracy: number // 0-100%
  attempts: number
  completedAt?: string
}

export interface SkillStats {
  letterRecognition: { correct: number; total: number }
  letterSequencing: { correct: number; total: number }
  tracingMotor: { correct: number; total: number }
  phonological: { correct: number; total: number }
  spellingRecognition: { correct: number; total: number }
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge'
  letterSpacing: 'normal' | 'wide' | 'extra-wide'
  wordSpacing: 'normal' | 'wide'
  fontFamily: 'standard' | 'dyslexic'
  highContrast: boolean
  reducedMotion: boolean
  sfxVolume: boolean
  audioAssistance: boolean
  speechSpeed: number // 0.7 to 1.1
}

export interface GameState {
  demoMode: boolean // Demo mode keeps all worlds/levels unlocked while retaining progression calculations
  progress: Record<string, LevelProgress> // key: `${worldId}-${levelId}`
  skillStats: SkillStats
  settings: AccessibilitySettings
  totalStars: number
  currentWorld: number
  currentLevel: number
}

const STORAGE_KEY = 'snk_wordsplash_state_v1'

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSize: 'normal',
  letterSpacing: 'wide', // Slightly wide by default for dyslexia friendliness
  wordSpacing: 'normal',
  fontFamily: 'standard',
  highContrast: false,
  reducedMotion: false,
  sfxVolume: true,
  audioAssistance: true,
  speechSpeed: 0.85,
}

export const INITIAL_GAME_STATE: GameState = {
  demoMode: true, // As requested: all worlds and levels open for this demo
  progress: {},
  skillStats: {
    letterRecognition: { correct: 0, total: 0 },
    letterSequencing: { correct: 0, total: 0 },
    tracingMotor: { correct: 0, total: 0 },
    phonological: { correct: 0, total: 0 },
    spellingRecognition: { correct: 0, total: 0 },
  },
  settings: DEFAULT_ACCESSIBILITY,
  totalStars: 0,
  currentWorld: 1,
  currentLevel: 1,
}

// World unlock thresholds (levels completed in previous world)
export const WORLD_UNLOCK_THRESHOLDS: Record<number, number> = {
  1: 0,  // Always unlocked
  2: 6,  // 6 levels in World 1
  3: 7,  // 7 levels in World 2
  4: 8,  // 8 levels in World 3
  5: 8,  // 8 levels in World 4
}

export function loadGameState(): GameState {
  if (typeof window === 'undefined') return INITIAL_GAME_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_GAME_STATE
    const parsed = JSON.parse(raw)
    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
      settings: { ...DEFAULT_ACCESSIBILITY, ...parsed.settings },
      demoMode: true, // Keep demo mode active
    }
  } catch {
    return INITIAL_GAME_STATE
  }
}

export function saveGameState(state: GameState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage quota
  }
}

export function isWorldUnlocked(worldId: number, state: GameState): boolean {
  if (state.demoMode) return true
  if (worldId === 1) return true

  const prevWorld = worldId - 1
  const required = WORLD_UNLOCK_THRESHOLDS[worldId] || 7
  let completedCount = 0

  for (let l = 1; l <= 10; l++) {
    if (state.progress[`${prevWorld}-${l}`]?.completed) {
      completedCount++
    }
  }

  return completedCount >= required
}

export function isLevelUnlocked(worldId: number, levelId: number, state: GameState): boolean {
  if (state.demoMode) return true
  if (!isWorldUnlocked(worldId, state)) return false
  if (levelId === 1) return true

  // Unlocked if previous level completed
  return !!state.progress[`${worldId}-${levelId - 1}`]?.completed
}

export function getCompletedLevelsCount(worldId: number, state: GameState): number {
  let count = 0
  for (let l = 1; l <= 10; l++) {
    if (state.progress[`${worldId}-${l}`]?.completed) {
      count++
    }
  }
  return count
}

export function getSkillPercentages(stats: SkillStats) {
  const calc = (s: { correct: number; total: number }) =>
    s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0

  return {
    letterRecognition: calc(stats.letterRecognition),
    letterSequencing: calc(stats.letterSequencing),
    tracingMotor: calc(stats.tracingMotor),
    phonological: calc(stats.phonological),
    spellingRecognition: calc(stats.spellingRecognition),
  }
}

export function getAdaptiveRecommendation(stats: SkillStats): { text: string; subtext: string; worldId: number } {
  const p = getSkillPercentages(stats)

  if (p.letterRecognition < 70 && stats.letterRecognition.total > 0) {
    return {
      text: "Let's splash more letters!",
      subtext: 'Boost your letter recognition with fun bubble games.',
      worldId: 1,
    }
  }
  if (p.letterSequencing < 70 && stats.letterSequencing.total > 0) {
    return {
      text: 'Great effort! Try Word Builder next.',
      subtext: 'Building short words helps sharpen letter ordering.',
      worldId: 2,
    }
  }
  if (p.tracingMotor < 70 && stats.tracingMotor.total > 0) {
    return {
      text: 'Handwriting flow practice!',
      subtext: 'Trace graceful strokes with calm, forgiving guides.',
      worldId: 3,
    }
  }
  if (p.phonological < 70 && stats.phonological.total > 0) {
    return {
      text: 'Sound & spelling match!',
      subtext: 'Listen and link phonics sounds to letters.',
      worldId: 4,
    }
  }

  return {
    text: "You're making wonderful progress!",
    subtext: 'Keep exploring new worlds and collecting stars.',
    worldId: 1,
  }
}
