// Web Audio API Synthesizer & Web Speech API for WordSplash

class SoundEngine {
  private ctx: AudioContext | null = null
  private sfxEnabled = true
  private voiceEnabled = true
  private speechRate = 0.85

  constructor() {
    // Lazy initialize on first user gesture
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
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

  public setVoiceEnabled(val: boolean) {
    this.voiceEnabled = val
  }

  public setSpeechRate(val: number) {
    this.speechRate = Math.max(0.5, Math.min(1.2, val))
  }

  // Play a water bubble pop sound
  public playBubblePop() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.08)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.09)
  }

  // Play a water splash / droplet burst
  public playSplash() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Dual tone for liquid feel
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = 'sine'
    osc2.type = 'triangle'

    osc1.frequency.setValueAtTime(520, now)
    osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.12)

    osc2.frequency.setValueAtTime(260, now)
    osc2.frequency.exponentialRampToValueAtTime(700, now + 0.15)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.18)
    osc2.stop(now + 0.18)
  }

  // Play a cheerful correct answer chime
  public playCorrect() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 chord arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const noteTime = now + idx * 0.06

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, noteTime)

      gain.gain.setValueAtTime(0.25, noteTime)
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(noteTime)
      osc.stop(noteTime + 0.26)
    })
  }

  // Play an encouraging gentle retry tone (no harsh buzzing)
  public playTryAgain() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.2)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.22)
  }

  // Play star award sound
  public playStar(starIndex: number) {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const baseFreqs = [587.33, 739.99, 880.0] // D5, F#5, A5
    const freq = baseFreqs[starIndex % baseFreqs.length]

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.2)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.36)
  }

  // Play level completion fanfare
  public playFanfare() {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
    ]

    let timeOffset = 0
    melody.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = now + timeOffset

      osc.type = 'sine'
      osc.frequency.setValueAtTime(note.f, t)

      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(t)
      osc.stop(t + note.d + 0.05)
      timeOffset += note.d * 0.9
    })
  }

  // Text-To-Speech speech pronunciation
  public speakWord(word: string, onEnd?: () => void) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd()
      return
    }

    try {
      window.speechSynthesis.cancel() // Stop previous utterances
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = this.speechRate
      utterance.pitch = 1.05
      utterance.lang = 'en-US'

      // Pick a friendly clear voice if available
      const voices = window.speechSynthesis.getVoices()
      const friendlyVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Karen'))
      )
      if (friendlyVoice) utterance.voice = friendlyVoice

      if (onEnd) {
        utterance.onend = onEnd
        utterance.onerror = onEnd
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      if (onEnd) onEnd()
    }
  }
}

export const soundEngine = new SoundEngine()
