import TopBarHeader from '../components/TopBarHeader'
import SpeakButton from '../components/SpeakButton'
import './StudentDashboard.css'

interface Props {
  onNavigate: (dest: 'games' | 'caregiver' | 'wordsplash') => void
}

const recentGame = {
  id: 'wordsplash',
  name: 'WordSplash',
  emoji: '💦',
  color: '#00D2D3',
  bg: 'linear-gradient(135deg, #1B2A4A 0%, #4A4FD4 100%)',
}

const frequentGames = [
  {
    id: 'wordsplash',
    name: 'WordSplash',
    color: '#4A4FD4',
    bg: 'linear-gradient(135deg, #1B2A4A 0%, #4A4FD4 100%)',
    emoji: '💦',
  },
  {
    id: 'numbershark',
    name: 'Numbershark',
    color: '#F5C518',
    bg: 'linear-gradient(135deg, #F5C518 0%, #FFE066 100%)',
    emoji: '🦈',
  },
]

export default function StudentDashboard({ onNavigate }: Props) {

  return (
    <div className="student-screen screen">
      <TopBarHeader
        title="Samuel's Adventure"
        speechText="Welcome back Samuel! Let's play your favorite games today."
      />
      <div className="screen-scroll">
        {/* Header */}
        <div className="st-header">
          <div className="st-avatar">
            <svg viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="30" fill="#4A90D9" />
              <circle cx="30" cy="22" r="11" fill="#FDBCB4" />
              <ellipse cx="30" cy="52" rx="17" ry="14" fill="#5B4FCF" />
              <path d="M19 20 Q20 10 30 10 Q40 10 41 20 Q38 14 30 14 Q22 14 19 20Z" fill="#3D2B1F" />
              {/* Eyes */}
              <circle cx="25" cy="22" r="3" fill="#3D2B1F" />
              <circle cx="35" cy="22" r="3" fill="#3D2B1F" />
              <circle cx="26" cy="21" r="1" fill="white" />
              <circle cx="36" cy="21" r="1" fill="white" />
              {/* Smile */}
              <path d="M25 28 Q30 33 35 28" stroke="#C97B5A" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div className="st-header-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="st-greeting">HEY, SAMUEL</span>
              <SpeakButton text="Hey Samuel! Ready to learn and play?" size="sm" />
            </div>
            <span className="st-role">Student</span>
          </div>
          <button className="st-notif" aria-label="Notifications">🔔</button>
        </div>

        {/* Welcome banner */}
        <div className="st-welcome-banner">
          <div className="st-welcome-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2>Welcome Back<br />Samuel</h2>
              <SpeakButton text="Welcome back Samuel! Let's play!" size="md" />
            </div>
            <button className="st-play-btn" onClick={() => onNavigate('wordsplash')}>
              let's play ▶
            </button>
          </div>
          <div className="st-flame-mascot">
            {/* Flame mascot */}
            <svg viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M60 145 C30 145 10 120 10 95 C10 70 25 55 25 42 C25 28 35 18 45 13 C43 26 50 33 55 28 C53 48 70 52 65 67 C75 52 80 32 75 17 C88 25 96 38 96 53 C101 42 104 27 101 13 C115 25 120 47 120 72 C120 108 106 145 60 145Z"
                fill="url(#flameGrad2)"
              />
              <path
                d="M60 136 C40 136 26 118 26 100 C26 84 36 74 42 62 C42 77 52 82 57 75 C55 89 64 93 62 104 C68 93 72 79 70 67 C80 77 84 92 84 104 C84 122 82 136 60 136Z"
                fill="#FF8C42"
              />
              {/* Eyes wider / happier */}
              <circle cx="48" cy="96" r="13" fill="white" />
              <circle cx="72" cy="96" r="13" fill="white" />
              <circle cx="50" cy="98" r="7.5" fill="#3D1C02" />
              <circle cx="74" cy="98" r="7.5" fill="#3D1C02" />
              <circle cx="53" cy="94" r="2.5" fill="white" />
              <circle cx="77" cy="94" r="2.5" fill="white" />
              {/* Big smile */}
              <path d="M46 112 Q60 122 74 112" stroke="#8B2500" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Arms up happy */}
              <path d="M22 85 Q12 70 18 55" stroke="#FF6B35" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M98 85 Q108 70 102 55" stroke="#FF6B35" strokeWidth="10" strokeLinecap="round" fill="none" />
              <defs>
                <linearGradient id="flameGrad2" x1="60" y1="13" x2="60" y2="145" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF4500" />
                  <stop offset="50%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#FF8C42" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Recently played */}
        <div className="st-section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Recently played</span>
          <SpeakButton text="Recently played: WordSplash. Let's play 5 worlds!" size="sm" />
        </div>
        <div
          className="st-recent-card"
          style={{ background: recentGame.bg }}
          onClick={() => onNavigate('wordsplash')}
        >
          <div className="st-recent-nums">
            <span className="num n1">W</span>
            <span className="num n4">O</span>
            <span className="num n2">R</span>
            <span className="num n5">D</span>
            <span className="num n6">S</span>
            <span className="num n3">!</span>
          </div>
          <div className="st-recent-info">
            <span className="st-recent-name">{recentGame.name}</span>
            <span className="st-recent-sub">let's play 5 worlds</span>
          </div>
          <div className="st-recent-shark">💦🫧</div>
        </div>

        {/* Frequently played */}
        <div className="st-section-title">Frequently played</div>
        <div className="st-frequent-grid">
          {frequentGames.map((g) => (
            <div
              key={g.name}
              className="st-freq-card"
              style={{ background: g.bg }}
              onClick={() => {
                if (g.id === 'wordsplash') onNavigate('wordsplash')
                else onNavigate('games')
              }}
            >
              <div className="st-freq-emoji">{g.emoji}</div>
              <div className="st-freq-name">{g.name}</div>
              <button className="st-freq-play">Tap to play</button>
            </div>
          ))}
        </div>

        {/* Switch to caregiver */}
        <div className="st-switch-row">
          <button className="st-switch-btn" onClick={() => onNavigate('caregiver')}>
            👩 Switch to Caregiver View
          </button>
        </div>

        {/* Decorative city strip */}
        <div className="st-city-strip">
          🏛️🌳🏰🌳🏯🌳🏛️
        </div>
      </div>


    </div>
  )
}
