// Universal Web Audio Synthesizer & Web Speech API Manager for SNK

class SoundEngine {
  private ctx: AudioContext | null = null
  private sfxEnabled = true
  private voiceEnabled = true
  private speechRate = 0.9
  private speechPitch = 1.05
  private sfxVolume = 0.7

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public setSfxEnabled(val: boolean) {
    this.sfxEnabled = val
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val))
  }

  public setVoiceEnabled(val: boolean) {
    this.voiceEnabled = val
  }

  public setSpeechRate(val: number) {
    this.speechRate = Math.max(0.5, Math.min(1.5, val))
  }

  public setSpeechPitch(val: number) {
    this.speechPitch = Math.max(0.6, Math.min(1.5, val))
  }

  // Soft UI click / tap sound
  public playClick() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04)

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  }

  // Water bubble pop
  public playBubblePop() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.07)

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.08)
  }

  // Soothing chime for correct answers / milestones
  public playCorrect() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + idx * 0.06

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.3)
    })
  }

  // Gentle calming cue
  public playGentlePrompt() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.25)

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.26)
  }

  // Text-To-Speech reader
  public speak(text: string, onEnd?: () => void) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd()
      return
    }

    try {
      window.speechSynthesis.cancel() // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = this.speechRate
      utterance.pitch = this.speechPitch
      utterance.lang = 'en-US'

      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('Google') ||
            v.name.includes('Karen') ||
            v.name.includes('Jenny'))
      )
      if (preferredVoice) utterance.voice = preferredVoice

      utterance.onend = () => {
        if (onEnd) onEnd()
      }
      utterance.onerror = () => {
        if (onEnd) onEnd()
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      if (onEnd) onEnd()
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }
}

export const soundEngine = new SoundEngine()
