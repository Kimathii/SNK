import { useState } from 'react'
import TopBarHeader from '../components/TopBarHeader'
import SpeakButton from '../components/SpeakButton'
import BottomNav from '../components/BottomNav'
import { useAccessibility } from '../context/AccessibilityContext'
import './GamesLibrary.css'

interface Props {
  onBack: () => void
  role: 'caregiver' | 'student'
  onPlayGame?: (gameId: string) => void
  onNavigateFamily?: () => void
}

type Filter = 'All' | 'SLD' | 'DND'

const GAMES = [
  {
    id: 'wordsplash',
    name: 'WordSplash',
    tagline: 'Splash through words & letters',
    emoji: '💦',
    bg: 'linear-gradient(135deg, #1B2A4A 0%, #4A4FD4 100%)',
    tags: ['SLD'] as Filter[],
    skills: ['Dyslexia', 'Dysgraphia', 'Phonics'],
    difficulty: 'All Levels (5 Worlds)',
    plays: 1480,
    color: '#00D2D3',
    featured: true,
  },
  {
    id: 'numbershark',
    name: 'Numbershark',
    tagline: 'Math made fun underwater',
    emoji: '🦈',
    bg: 'linear-gradient(135deg, #F5C518 0%, #FFB800 100%)',
    tags: ['SLD', 'DND'] as Filter[],
    skills: ['Dyscalculia', 'ADHD Focus'],
    difficulty: 'Beginner',
    plays: 1240,
    color: '#F5C518',
    featured: true,
  },
  {
    id: 'detective-lonny',
    name: 'Detective Lonny',
    tagline: 'Solve mysteries, build logic',
    emoji: '🔍',
    bg: 'linear-gradient(135deg, #8E44AD 0%, #A569BD 100%)',
    tags: ['DND'] as Filter[],
    skills: ['ASD', 'ADHD'],
    difficulty: 'Intermediate',
    plays: 760,
    color: '#8E44AD',
    featured: true,
  },
  {
    id: 'jungle-adventure',
    name: 'Jungle Adventure',
    tagline: 'Explore, learn & grow',
    emoji: '🌿',
    bg: 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)',
    tags: ['SLD', 'DND'] as Filter[],
    skills: ['General Learning', 'SLP'],
    difficulty: 'Intermediate',
    plays: 620,
    color: '#27AE60',
    featured: false,
  },
]

const FILTERS: Filter[] = ['All', 'SLD', 'DND']

export default function GamesLibrary({ onBack, role, onPlayGame, onNavigateFamily }: Props) {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')
  const { activeLayout } = useAccessibility()

  const filtered = GAMES.filter((g) => {
    const matchesFilter = activeFilter === 'All' || g.tags.includes(activeFilter)
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const featured = filtered.filter((g) => g.featured)
  const rest = filtered.filter((g) => !g.featured)

  return (
    <div className="games-screen screen">
      <TopBarHeader
        title="Games Library"
        showBack={true}
        onBack={onBack}
        speechText="Welcome to the Games Library! Choose a game to start learning."
      />

      <div className="screen-scroll">
        {/* Search */}
        <div className="gm-search-row">
          <div className="gm-search-wrap">
            <span className="gm-search-icon">🔍</span>
            <input
              className="gm-search"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="gm-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`gm-filter-chip ${activeFilter === f ? 'gm-filter-chip--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'All' ? 'All Games' : f === 'SLD' ? '🔤 SLD' : '🧠 DND'}
            </button>
          ))}
        </div>

        {/* Featured games - first 3 prominent */}
        {featured.length > 0 && (
          <>
            <p className="gm-section-label">⭐ Featured</p>
            <div className="gm-featured-list">
              {featured.map((game) => (
                <div
                  key={game.id}
                  className="gm-featured-card"
                  style={{ background: game.bg }}
                  onClick={() => onPlayGame && onPlayGame(game.id)}
                >
                  <div className="gm-featured-left">
                    <div className="gm-featured-emoji">{game.emoji}</div>
                    <div className="gm-featured-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="gm-featured-name">{game.name}</span>
                        <SpeakButton text={`${game.name}. ${game.tagline}. Targets ${game.skills.join(', ')}.`} size="sm" />
                      </div>
                      <span className="gm-featured-tagline">{game.tagline}</span>
                      <div className="gm-featured-tags">
                        {game.tags.map((t) => (
                          <span key={t} className="gm-tag gm-tag--light">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="gm-featured-right">
                    <div className="gm-skill-chips">
                      {game.skills.map((s) => (
                        <span key={s} className="gm-skill-chip">{s}</span>
                      ))}
                    </div>
                    <button
                      className="gm-play-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onPlayGame) onPlayGame(game.id)
                      }}
                    >
                      {role === 'student' ? '▶ Play' : '▶ Preview'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* More games grid */}
        {rest.length > 0 && (
          <>
            <p className="gm-section-label">More Games</p>
            <div className="gm-grid">
              {rest.map((game) => (
                <div
                  key={game.id}
                  className="gm-grid-card"
                  style={{ background: game.bg }}
                  onClick={() => onPlayGame && onPlayGame(game.id)}
                >
                  <div className="gm-grid-emoji">{game.emoji}</div>
                  <span className="gm-grid-name">{game.name}</span>
                  <div className="gm-grid-tags">
                    {game.tags.map((t) => (
                      <span key={t} className="gm-tag gm-tag--light gm-tag--sm">{t}</span>
                    ))}
                  </div>
                  <button
                    className="gm-grid-play"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onPlayGame) onPlayGame(game.id)
                    }}
                  >
                    {role === 'student' ? 'Play' : 'Preview'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="gm-empty">
            <span>🎮</span>
            <p>No games match your search.</p>
          </div>
        )}

        {/* Therapy coming soon */}
        <div className="gm-therapy-banner">
          <div className="gm-therapy-icon">🩺</div>
          <div>
            <p className="gm-therapy-title">Therapy Area — Coming Soon</p>
            <p className="gm-therapy-sub">
              Interactive therapy sessions with certified specialists will be available here. Stay tuned.
            </p>
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>

      {activeLayout === 'phone' && (
        <BottomNav
          active="games"
          onNavigate={(item) => {
            if (item === 'home') onBack()
            else if (item === 'family' && onNavigateFamily) onNavigateFamily()
          }}
        />
      )}
    </div>
  )
}
