// Comprehensive Level Definitions for WordSplash (5 Worlds x 10 Levels = 50 Levels)

export interface LetterBubble {
  id: string
  char: string
  isTarget: boolean
  x?: number // percentage (0-100)
  y?: number // percentage (0-100)
  size?: number
  fontClass?: string
}

export interface TracePoint {
  x: number // 0-100 normalized coordinate
  y: number
}

export interface TracePath {
  id: string
  points: TracePoint[]
  label?: string
  instruction?: string
}

export interface LevelData {
  id: number
  worldId: number
  title: string
  instruction: string
  focusSkill: 'letterRecognition' | 'letterSequencing' | 'tracingMotor' | 'phonological' | 'spellingRecognition'
  timeLimitSec?: number

  // World 1: Letter Splash
  targetLetter?: string
  targetHint?: string
  bubbles?: LetterBubble[]

  // World 2 & 4: Word Builder / Listen & Build
  targetWord?: string
  scrambledLetters?: string[]
  wordMeaning?: string
  phoneticAudioPrompt?: string
  imageEmoji?: string

  // World 3: Trace & Splash
  traceCharacter?: string
  tracePaths?: TracePath[]
  guideLevel?: 'full' | 'medium' | 'minimal'

  // World 5: Word Splash (Spelling choices)
  wordOptions?: { id: string; text: string; isCorrect: boolean; explanation?: string }[]
}

export interface WorldData {
  id: number
  title: string
  subtitle: string
  themeColor: string
  bgGradient: string
  iconEmoji: string
  focusDescription: string
  levels: LevelData[]
}

export const WORLDS_DATA: WorldData[] = [
  // ==========================================
  // WORLD 1 — LETTER SPLASH
  // ==========================================
  {
    id: 1,
    title: 'Letter Splash',
    subtitle: 'Letter recognition & visual discrimination',
    themeColor: '#4A4FD4',
    bgGradient: 'linear-gradient(135deg, #1B2A4A 0%, #2A3B66 100%)',
    iconEmoji: '🌊',
    focusDescription: 'Spot target letters and tell apart tricky letter shapes.',
    levels: [
      {
        id: 1,
        worldId: 1,
        title: 'Find the Letter A',
        instruction: 'Tap all the "A" letter bubbles floating in the water!',
        focusSkill: 'letterRecognition',
        targetLetter: 'A',
        targetHint: 'Look for capital "A"',
        bubbles: [
          { id: 'b1', char: 'A', isTarget: true },
          { id: 'b2', char: 'M', isTarget: false },
          { id: 'b3', char: 'A', isTarget: true },
          { id: 'b4', char: 'T', isTarget: false },
          { id: 'b5', char: 'O', isTarget: false },
          { id: 'b6', char: 'A', isTarget: true },
        ],
      },
      {
        id: 2,
        worldId: 1,
        title: 'Similar Shapes: C & O',
        instruction: 'Splash the letter "C" - look closely at the open curve!',
        focusSkill: 'letterRecognition',
        targetLetter: 'C',
        targetHint: 'Open on the right side',
        bubbles: [
          { id: 'b1', char: 'C', isTarget: true },
          { id: 'b2', char: 'O', isTarget: false },
          { id: 'b3', char: 'O', isTarget: false },
          { id: 'b4', char: 'C', isTarget: true },
          { id: 'b5', char: 'G', isTarget: false },
          { id: 'b6', char: 'C', isTarget: true },
        ],
      },
      {
        id: 3,
        worldId: 1,
        title: 'Upper & Lowercase: S & s',
        instruction: 'Find both big "S" and small "s" bubbles!',
        focusSkill: 'letterRecognition',
        targetLetter: 'S',
        targetHint: 'Matches S or s',
        bubbles: [
          { id: 'b1', char: 'S', isTarget: true },
          { id: 'b2', char: 's', isTarget: true },
          { id: 'b3', char: 'Z', isTarget: false },
          { id: 'b4', char: '5', isTarget: false },
          { id: 'b5', char: 'S', isTarget: true },
          { id: 'b6', char: 'z', isTarget: false },
        ],
      },
      {
        id: 4,
        worldId: 1,
        title: 'Tricky Twins: b vs d',
        instruction: 'Pop only the letter "b" bubbles! (belly on the right)',
        focusSkill: 'letterRecognition',
        targetLetter: 'b',
        targetHint: 'Bat then ball: line on left, circle on right',
        bubbles: [
          { id: 'b1', char: 'b', isTarget: true },
          { id: 'b2', char: 'd', isTarget: false },
          { id: 'b3', char: 'b', isTarget: true },
          { id: 'b4', char: 'd', isTarget: false },
          { id: 'b5', char: 'd', isTarget: false },
          { id: 'b6', char: 'b', isTarget: true },
        ],
      },
      {
        id: 5,
        worldId: 1,
        title: 'Tricky Twins: p vs q',
        instruction: 'Splash only the letter "p" bubbles!',
        focusSkill: 'letterRecognition',
        targetLetter: 'p',
        targetHint: 'Tail down, circle on the right',
        bubbles: [
          { id: 'b1', char: 'p', isTarget: true },
          { id: 'b2', char: 'q', isTarget: false },
          { id: 'b3', char: 'q', isTarget: false },
          { id: 'b4', char: 'p', isTarget: true },
          { id: 'b5', char: 'p', isTarget: true },
          { id: 'b6', char: 'g', isTarget: false },
        ],
      },
      {
        id: 6,
        worldId: 1,
        title: 'The Great b / d / p / q Quad',
        instruction: 'Find all the "d" bubbles among b, d, p, and q!',
        focusSkill: 'letterRecognition',
        targetLetter: 'd',
        targetHint: 'Doorknob then door: circle on left, tall stick on right',
        bubbles: [
          { id: 'b1', char: 'b', isTarget: false },
          { id: 'b2', char: 'd', isTarget: true },
          { id: 'b3', char: 'p', isTarget: false },
          { id: 'b4', char: 'q', isTarget: false },
          { id: 'b5', char: 'd', isTarget: true },
          { id: 'b6', char: 'd', isTarget: true },
          { id: 'b7', char: 'b', isTarget: false },
        ],
      },
      {
        id: 7,
        worldId: 1,
        title: 'Multi-Font Detective: E & e',
        instruction: 'Find the letter "E" in different sizes and fonts!',
        focusSkill: 'letterRecognition',
        targetLetter: 'E',
        targetHint: 'Any size or font of E / e',
        bubbles: [
          { id: 'b1', char: 'E', isTarget: true, size: 1.3 },
          { id: 'b2', char: 'F', isTarget: false },
          { id: 'b3', char: 'e', isTarget: true, size: 0.9 },
          { id: 'b4', char: 'B', isTarget: false },
          { id: 'b5', char: 'E', isTarget: true, fontClass: 'serif' },
          { id: 'b6', char: 'H', isTarget: false },
        ],
      },
      {
        id: 8,
        worldId: 1,
        title: 'Letter Inside Words: M in M-A-P',
        instruction: 'Find all the "M" and "m" bubbles from the word MAP!',
        focusSkill: 'letterRecognition',
        targetLetter: 'M',
        targetHint: 'Mountain peaks: M or m',
        bubbles: [
          { id: 'b1', char: 'M', isTarget: true },
          { id: 'b2', char: 'W', isTarget: false },
          { id: 'b3', char: 'N', isTarget: false },
          { id: 'b4', char: 'm', isTarget: true },
          { id: 'b5', char: 'A', isTarget: false },
          { id: 'b6', char: 'M', isTarget: true },
        ],
      },
      {
        id: 1,
        worldId: 1,
        title: 'Fast Splash Reflex: T & t',
        instruction: 'Splash 3 target "T" bubbles as quickly as you can!',
        focusSkill: 'letterRecognition',
        targetLetter: 'T',
        targetHint: 'Top crossbar with stem',
        bubbles: [
          { id: 'b1', char: 'T', isTarget: true },
          { id: 'b2', char: 'I', isTarget: false },
          { id: 'b3', char: 'L', isTarget: false },
          { id: 'b4', char: 't', isTarget: true },
          { id: 'b5', char: 'T', isTarget: true },
          { id: 'b6', char: 'J', isTarget: false },
        ],
      },
      {
        id: 10,
        worldId: 1,
        title: 'World 1 Grand Splash!',
        instruction: 'Grand Challenge: Find all the "k" and "K" letters!',
        focusSkill: 'letterRecognition',
        targetLetter: 'K',
        targetHint: 'Tall stick with two diagonal arms',
        bubbles: [
          { id: 'b1', char: 'K', isTarget: true },
          { id: 'b2', char: 'X', isTarget: false },
          { id: 'b3', char: 'k', isTarget: true },
          { id: 'b4', char: 'H', isTarget: false },
          { id: 'b5', char: 'R', isTarget: false },
          { id: 'b6', char: 'K', isTarget: true },
          { id: 'b7', char: 'k', isTarget: true },
        ],
      },
    ],
  },

  // ==========================================
  // WORLD 2 — WORD BUILDER
  // ==========================================
  {
    id: 2,
    title: 'Word Builder',
    subtitle: 'Letter sequencing, construction & spelling',
    themeColor: '#2ECC71',
    bgGradient: 'linear-gradient(135deg, #0D2C24 0%, #1A4D3E 100%)',
    iconEmoji: '🧩',
    focusDescription: 'Arrange and sequence letter tiles to build sparkling words.',
    levels: [
      {
        id: 1,
        worldId: 2,
        title: 'Simple 3-Letter: C-A-T',
        instruction: 'Arrange the letter tiles in order to spell "CAT" 🐱',
        focusSkill: 'letterSequencing',
        targetWord: 'CAT',
        scrambledLetters: ['A', 'C', 'T'],
        imageEmoji: '🐱',
        wordMeaning: 'A furry playful pet',
      },
      {
        id: 2,
        worldId: 2,
        title: 'Bright Sun: S-U-N',
        instruction: 'Arrange the tiles to build "SUN" ☀️',
        focusSkill: 'letterSequencing',
        targetWord: 'SUN',
        scrambledLetters: ['U', 'S', 'N'],
        imageEmoji: '☀️',
        wordMeaning: 'The bright star in our daytime sky',
      },
      {
        id: 3,
        worldId: 2,
        title: 'Water Friend: F-I-S-H',
        instruction: 'Unscramble the letters to build "FISH" 🐟',
        focusSkill: 'letterSequencing',
        targetWord: 'FISH',
        scrambledLetters: ['S', 'F', 'H', 'I'],
        imageEmoji: '🐟',
        wordMeaning: 'An animal that swims in water',
      },
      {
        id: 4,
        worldId: 2,
        title: 'Playful Frog: F-R-O-G',
        instruction: 'Build the 4-letter word "FROG" 🐸',
        focusSkill: 'letterSequencing',
        targetWord: 'FROG',
        scrambledLetters: ['R', 'G', 'F', 'O'],
        imageEmoji: '🐸',
        wordMeaning: 'A green hopping animal',
      },
      {
        id: 5,
        worldId: 2,
        title: 'Starry Sky: S-T-A-R',
        instruction: 'Arrange the tiles to spell "STAR" ⭐',
        focusSkill: 'letterSequencing',
        targetWord: 'STAR',
        scrambledLetters: ['T', 'A', 'S', 'R'],
        imageEmoji: '⭐',
        wordMeaning: 'A glowing point of light at night',
      },
      {
        id: 6,
        worldId: 2,
        title: 'Water Drops: W-A-T-E-R',
        instruction: 'Build the 5-letter word "WATER" 💧',
        focusSkill: 'letterSequencing',
        targetWord: 'WATER',
        scrambledLetters: ['T', 'W', 'E', 'A', 'R'],
        imageEmoji: '💧',
        wordMeaning: 'Clear liquid essential for life',
      },
      {
        id: 7,
        worldId: 2,
        title: 'Repeated Letters: A-P-P-L-E',
        instruction: 'Build "APPLE" with two "P" letter tiles 🍎',
        focusSkill: 'letterSequencing',
        targetWord: 'APPLE',
        scrambledLetters: ['P', 'A', 'L', 'P', 'E'],
        imageEmoji: '🍎',
        wordMeaning: 'A crisp, sweet fruit',
      },
      {
        id: 8,
        worldId: 2,
        title: 'Double Bubble: B-U-B-B-L-E',
        instruction: 'Construct "BUBBLE" with 3 B tiles! 🫧',
        focusSkill: 'letterSequencing',
        targetWord: 'BUBBLE',
        scrambledLetters: ['B', 'U', 'L', 'B', 'E', 'B'],
        imageEmoji: '🫧',
        wordMeaning: 'A thin floating sphere of soapy water',
      },
      {
        id: 9,
        worldId: 2,
        title: 'Joyful Splash: S-P-L-A-S-H',
        instruction: 'Spell our favorite word "SPLASH"! 💦',
        focusSkill: 'letterSequencing',
        targetWord: 'SPLASH',
        scrambledLetters: ['L', 'S', 'A', 'P', 'H', 'S'],
        imageEmoji: '💦',
        wordMeaning: 'To scatter water in droplets',
      },
      {
        id: 10,
        worldId: 2,
        title: 'World 2 Master: F-R-I-E-N-D',
        instruction: 'Grand Challenge: Spell "FRIEND" 🤝 (remember i before e!)',
        focusSkill: 'letterSequencing',
        targetWord: 'FRIEND',
        scrambledLetters: ['R', 'F', 'E', 'I', 'D', 'N'],
        imageEmoji: '🤝',
        wordMeaning: 'Someone who cares and plays with you',
      },
    ],
  },

  // ==========================================
  // WORLD 3 — TRACE & SPLASH
  // ==========================================
  {
    id: 3,
    title: 'Trace & Splash',
    subtitle: 'Handwriting, letter formation & motor flow',
    themeColor: '#FF6B35',
    bgGradient: 'linear-gradient(135deg, #2D1408 0%, #522510 100%)',
    iconEmoji: '✍️',
    focusDescription: 'Trace letter curves smoothly to build motor memory with dysgraphia support.',
    levels: [
      {
        id: 1,
        worldId: 3,
        title: 'Trace Curve: Letter C',
        instruction: 'Start at the green dot and trace smoothly to the end!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'C',
        guideLevel: 'full',
        tracePaths: [
          {
            id: 'c1',
            label: 'Stroke 1',
            points: [
              { x: 75, y: 25 },
              { x: 50, y: 15 },
              { x: 25, y: 35 },
              { x: 20, y: 50 },
              { x: 25, y: 70 },
              { x: 50, y: 85 },
              { x: 75, y: 75 },
            ],
          },
        ],
      },
      {
        id: 2,
        worldId: 3,
        title: 'Circle Round: Letter O',
        instruction: 'Trace around the circle clockwise from the top!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'O',
        guideLevel: 'full',
        tracePaths: [
          {
            id: 'o1',
            label: 'Stroke 1',
            points: [
              { x: 50, y: 15 },
              { x: 25, y: 30 },
              { x: 20, y: 50 },
              { x: 25, y: 70 },
              { x: 50, y: 85 },
              { x: 75, y: 70 },
              { x: 80, y: 50 },
              { x: 75, y: 30 },
              { x: 50, y: 15 },
            ],
          },
        ],
      },
      {
        id: 3,
        worldId: 3,
        title: 'Straight & Across: Letter L',
        instruction: 'Trace straight down, then slide to the right!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'L',
        guideLevel: 'full',
        tracePaths: [
          {
            id: 'l1',
            points: [
              { x: 30, y: 15 },
              { x: 30, y: 50 },
              { x: 30, y: 85 },
              { x: 55, y: 85 },
              { x: 75, y: 85 },
            ],
          },
        ],
      },
      {
        id: 4,
        worldId: 3,
        title: 'Wavy River: Letter S',
        instruction: 'Trace the S curve like a swimming river fish!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'S',
        guideLevel: 'full',
        tracePaths: [
          {
            id: 's1',
            points: [
              { x: 70, y: 25 },
              { x: 50, y: 15 },
              { x: 30, y: 30 },
              { x: 50, y: 50 },
              { x: 70, y: 70 },
              { x: 50, y: 85 },
              { x: 30, y: 75 },
            ],
          },
        ],
      },
      {
        id: 5,
        worldId: 3,
        title: 'Uppercase Pyramid: Letter A',
        instruction: 'Trace up and down the mountain, then cross the bridge!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'A',
        guideLevel: 'full',
        tracePaths: [
          {
            id: 'a1',
            points: [
              { x: 25, y: 85 },
              { x: 50, y: 15 },
              { x: 75, y: 85 },
            ],
          },
        ],
      },
      {
        id: 6,
        worldId: 3,
        title: 'Stick and Belly: Letter b',
        instruction: 'Trace straight down, then loop the friendly round belly!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'b',
        guideLevel: 'medium',
        tracePaths: [
          {
            id: 'b1',
            points: [
              { x: 30, y: 15 },
              { x: 30, y: 85 },
              { x: 55, y: 85 },
              { x: 75, y: 65 },
              { x: 55, y: 45 },
              { x: 30, y: 45 },
            ],
          },
        ],
      },
      {
        id: 7,
        worldId: 3,
        title: 'Round & Tail: Letter d',
        instruction: 'Trace the round body first, then the tall straight stick!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'd',
        guideLevel: 'medium',
        tracePaths: [
          {
            id: 'd1',
            points: [
              { x: 70, y: 45 },
              { x: 45, y: 45 },
              { x: 25, y: 65 },
              { x: 45, y: 85 },
              { x: 70, y: 85 },
              { x: 70, y: 15 },
            ],
          },
        ],
      },
      {
        id: 8,
        worldId: 3,
        title: 'Gentle Flow: Word GO',
        instruction: 'Trace the connected word "G-O" with relaxed strokes!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'GO',
        guideLevel: 'medium',
        tracePaths: [
          {
            id: 'g1',
            points: [
              { x: 40, y: 25 },
              { x: 20, y: 45 },
              { x: 40, y: 75 },
              { x: 40, y: 55 },
              { x: 30, y: 55 },
            ],
          },
          {
            id: 'o1',
            points: [
              { x: 70, y: 35 },
              { x: 55, y: 55 },
              { x: 70, y: 75 },
              { x: 85, y: 55 },
              { x: 70, y: 35 },
            ],
          },
        ],
      },
      {
        id: 9,
        worldId: 3,
        title: 'Minimal Guide: Letter M',
        instruction: 'Trace M with lighter guide dots — trust your muscle memory!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'M',
        guideLevel: 'minimal',
        tracePaths: [
          {
            id: 'm1',
            points: [
              { x: 20, y: 85 },
              { x: 20, y: 20 },
              { x: 50, y: 60 },
              { x: 80, y: 20 },
              { x: 80, y: 85 },
            ],
          },
        ],
      },
      {
        id: 10,
        worldId: 3,
        title: 'World 3 Grand Writer!',
        instruction: 'Grand Challenge: Trace the sparkling word "JOY" freely!',
        focusSkill: 'tracingMotor',
        traceCharacter: 'JOY',
        guideLevel: 'minimal',
        tracePaths: [
          {
            id: 'j1',
            points: [
              { x: 30, y: 20 },
              { x: 30, y: 70 },
              { x: 15, y: 70 },
            ],
          },
          {
            id: 'o1',
            points: [
              { x: 50, y: 35 },
              { x: 40, y: 55 },
              { x: 50, y: 75 },
              { x: 60, y: 55 },
              { x: 50, y: 35 },
            ],
          },
          {
            id: 'y1',
            points: [
              { x: 70, y: 35 },
              { x: 80, y: 55 },
              { x: 90, y: 35 },
              { x: 80, y: 55 },
              { x: 75, y: 85 },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // WORLD 4 — LISTEN & BUILD
  // ==========================================
  {
    id: 4,
    title: 'Listen & Build',
    subtitle: 'Phonological processing & sound-to-letter',
    themeColor: '#F5C518',
    bgGradient: 'linear-gradient(135deg, #302404 0%, #574008 100%)',
    iconEmoji: '🔊',
    focusDescription: 'Listen to spoken words and assemble matching letter tiles.',
    levels: [
      {
        id: 1,
        worldId: 4,
        title: 'Listen: B-A-T',
        instruction: 'Listen to the word 🔊 and build it with letter tiles!',
        focusSkill: 'phonological',
        targetWord: 'BAT',
        scrambledLetters: ['T', 'B', 'A'],
        phoneticAudioPrompt: 'Bat',
        imageEmoji: '🦇',
        wordMeaning: 'A creature that flies at night',
      },
      {
        id: 2,
        worldId: 4,
        title: 'Listen: D-O-G',
        instruction: 'Tap speaker to hear 🔊 "DOG", then arrange letters!',
        focusSkill: 'phonological',
        targetWord: 'DOG',
        scrambledLetters: ['O', 'G', 'D'],
        phoneticAudioPrompt: 'Dog',
        imageEmoji: '🐶',
        wordMeaning: 'A loyal barking friend',
      },
      {
        id: 3,
        worldId: 4,
        title: 'Listen: R-A-I-N',
        instruction: 'Listen 🔊 "RAIN" and sequence the vowel team A-I!',
        focusSkill: 'phonological',
        targetWord: 'RAIN',
        scrambledLetters: ['I', 'R', 'A', 'N'],
        phoneticAudioPrompt: 'Rain',
        imageEmoji: '🌧️',
        wordMeaning: 'Water falling from clouds',
      },
      {
        id: 4,
        worldId: 4,
        title: 'Listen: D-U-C-K',
        instruction: 'Listen 🔊 "DUCK" with the "CK" ending sound!',
        focusSkill: 'phonological',
        targetWord: 'DUCK',
        scrambledLetters: ['C', 'D', 'K', 'U'],
        phoneticAudioPrompt: 'Duck',
        imageEmoji: '🦆',
        wordMeaning: 'A quacking water bird',
      },
      {
        id: 5,
        worldId: 4,
        title: 'Listen: C-L-O-U-D',
        instruction: 'Listen 🔊 "CLOUD" - hear the OU sound blend!',
        focusSkill: 'phonological',
        targetWord: 'CLOUD',
        scrambledLetters: ['O', 'C', 'U', 'L', 'D'],
        phoneticAudioPrompt: 'Cloud',
        imageEmoji: '☁️',
        wordMeaning: 'A fluffy white shape in the sky',
      },
      {
        id: 6,
        worldId: 4,
        title: 'Listen: H-A-P-P-Y',
        instruction: 'Listen 🔊 "HAPPY" with double P sound!',
        focusSkill: 'phonological',
        targetWord: 'HAPPY',
        scrambledLetters: ['P', 'H', 'Y', 'A', 'P'],
        phoneticAudioPrompt: 'Happy',
        imageEmoji: '😊',
        wordMeaning: 'Feeling joyful and full of smiles',
      },
      {
        id: 7,
        worldId: 4,
        title: 'Listen: L-I-G-H-T',
        instruction: 'Listen 🔊 "LIGHT" with the silent "IGH" spelling pattern!',
        focusSkill: 'phonological',
        targetWord: 'LIGHT',
        scrambledLetters: ['G', 'L', 'H', 'I', 'T'],
        phoneticAudioPrompt: 'Light',
        imageEmoji: '💡',
        wordMeaning: 'Brightness that lets us see',
      },
      {
        id: 8,
        worldId: 4,
        title: 'Listen: O-C-E-A-N',
        instruction: 'Listen 🔊 "OCEAN" - notice the special EA vowel sound!',
        focusSkill: 'phonological',
        targetWord: 'OCEAN',
        scrambledLetters: ['C', 'O', 'A', 'E', 'N'],
        phoneticAudioPrompt: 'Ocean',
        imageEmoji: '🌊',
        wordMeaning: 'A vast body of deep blue saltwater',
      },
      {
        id: 9,
        worldId: 4,
        title: 'Listen: D-O-L-P-H-I-N',
        instruction: 'Listen 🔊 "DOLPHIN" with the "PH" /f/ sound!',
        focusSkill: 'phonological',
        targetWord: 'DOLPHIN',
        scrambledLetters: ['P', 'D', 'H', 'O', 'I', 'L', 'N'],
        phoneticAudioPrompt: 'Dolphin',
        imageEmoji: '🐬',
        wordMeaning: 'An intelligent playful sea mammal',
      },
      {
        id: 10,
        worldId: 4,
        title: 'World 4 Grand Challenge: BUTTERFLY',
        instruction: 'Grand Challenge: Listen 🔊 "BUTTERFLY" and build it all!',
        focusSkill: 'phonological',
        targetWord: 'BUTTERFLY',
        scrambledLetters: ['T', 'B', 'E', 'U', 'R', 'T', 'L', 'F', 'Y'],
        phoneticAudioPrompt: 'Butterfly',
        imageEmoji: '🦋',
        wordMeaning: 'A beautiful winged insect that flutters',
      },
    ],
  },

  // ==========================================
  // WORLD 5 — WORD SPLASH
  // ==========================================
  {
    id: 5,
    title: 'Word Splash',
    subtitle: 'Spelling recognition & valid word discrimination',
    themeColor: '#00D2D3',
    bgGradient: 'linear-gradient(135deg, #05262B 0%, #0B464F 100%)',
    iconEmoji: '💦',
    focusDescription: 'Splash the correctly spelled word among subtle tricky distractors.',
    levels: [
      {
        id: 1,
        worldId: 5,
        title: 'Obvious Mistake: HOUSE',
        instruction: 'Splash the word that is spelled 100% correctly! 🏠',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'HOUZE', isCorrect: false },
          { id: 'o2', text: 'HOUSE', isCorrect: true, explanation: 'HOUSE uses SE at the end' },
          { id: 'o3', text: 'HAUS', isCorrect: false },
        ],
      },
      {
        id: 2,
        worldId: 5,
        title: 'One-Letter Mistake: WATER',
        instruction: 'Splash the correct spelling of WATER! 💧',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'WOTER', isCorrect: false },
          { id: 'o2', text: 'WATER', isCorrect: true, explanation: 'WATER begins with W-A' },
          { id: 'o3', text: 'WATIR', isCorrect: false },
        ],
      },
      {
        id: 3,
        worldId: 5,
        title: 'Confused Vowels: SCHOOL',
        instruction: 'Find the correct spelling of SCHOOL! 🏫',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'SKOOL', isCorrect: false },
          { id: 'o2', text: 'SHCOOL', isCorrect: false },
          { id: 'o3', text: 'SCHOOL', isCorrect: true, explanation: 'SCHOOL has SCH and OO' },
        ],
      },
      {
        id: 4,
        worldId: 5,
        title: 'Tricky Pair: FRIEND',
        instruction: 'Remember "i before e": Which spelling is right? 🤝',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'FREIND', isCorrect: false },
          { id: 'o2', text: 'FRIEND', isCorrect: true, explanation: 'FRIEND has I before E' },
          { id: 'o3', text: 'FRIND', isCorrect: false },
        ],
      },
      {
        id: 5,
        worldId: 5,
        title: 'Double Letters: BALLOON',
        instruction: 'Splash the right BALLOON with double letters! 🎈',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'BALOON', isCorrect: false },
          { id: 'o2', text: 'BALLON', isCorrect: false },
          { id: 'o3', text: 'BALLOON', isCorrect: true, explanation: 'BALLOON has double L and double O' },
        ],
      },
      {
        id: 6,
        worldId: 5,
        title: 'Silent Letter: KNIGHT',
        instruction: 'Find the noble KNIGHT with the silent K! 🛡️',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'NIGHT', isCorrect: false },
          { id: 'o2', text: 'KNIGHT', isCorrect: true, explanation: 'KNIGHT starts with silent K' },
          { id: 'o3', text: 'KNITE', isCorrect: false },
        ],
      },
      {
        id: 7,
        worldId: 5,
        title: 'Special Ending: LAUGH',
        instruction: 'Splash the correct word LAUGH! 😄',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'LAFF', isCorrect: false },
          { id: 'o2', text: 'LAUGH', isCorrect: true, explanation: 'LAUGH ends with UGH' },
          { id: 'o3', text: 'LAFGH', isCorrect: false },
        ],
      },
      {
        id: 8,
        worldId: 5,
        title: 'Multiple Choices: BECAUSE',
        instruction: 'Which bubble has the true spelling of BECAUSE? 🤔',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'BECOS', isCorrect: false },
          { id: 'o2', text: 'BECAWS', isCorrect: false },
          { id: 'o3', text: 'BECAUSE', isCorrect: true, explanation: 'Big Elephants Can Always Understand Small Elephants' },
          { id: 'o4', text: 'BECUASE', isCorrect: false },
        ],
      },
      {
        id: 9,
        worldId: 5,
        title: 'Famous Challenge: BEAUTIFUL',
        instruction: 'Splash the real spelling: BEAUTIFUL! 🌺',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'BEUTIFUL', isCorrect: false },
          { id: 'o2', text: 'BEAUTIFULL', isCorrect: false },
          { id: 'o3', text: 'BEAUTIFUL', isCorrect: true, explanation: 'B-E-A-U-T-I-F-U-L has single L at end' },
          { id: 'o4', text: 'BUTIFUL', isCorrect: false },
        ],
      },
      {
        id: 10,
        worldId: 5,
        title: 'World 5 Grand Champion Splash!',
        instruction: 'Grand Championship: Splash all 3 correctly spelled words!',
        focusSkill: 'spellingRecognition',
        wordOptions: [
          { id: 'o1', text: 'TOMORROW', isCorrect: true, explanation: 'One M, double R' },
          { id: 'o2', text: 'TOMMOROW', isCorrect: false },
          { id: 'o3', text: 'SURPRISE', isCorrect: true, explanation: 'SURPRISE has the first R' },
          { id: 'o4', text: 'SUPRISE', isCorrect: false },
        ],
      },
    ],
  },
]
