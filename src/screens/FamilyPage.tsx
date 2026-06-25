import './FamilyPage.css'

interface Props {
  onBack: () => void
  onSelectChild: (childId: string) => void
}

export const CHILDREN = [
  {
    id: 'samuel',
    name: 'Samuel',
    age: 9,
    condition: 'Dyslexia · ADHD',
    tags: ['SLD', 'DND'],
    avatar: '👦',
    avatarBg: '#4A90D9',
    streak: 12,
    weeklyHours: 7,
    gamesPlayed: 42,
    lastActive: 'Today',
    nextSession: 'Thu, Jun 26 · 3:00 PM',
    therapist: 'Dr. Amaka Obi',
    progress: 78,
  },
  {
    id: 'grace',
    name: 'Grace',
    age: 7,
    condition: 'Dyscalculia',
    tags: ['SLD'],
    avatar: '👧',
    avatarBg: '#E74C3C',
    streak: 5,
    weeklyHours: 4,
    gamesPlayed: 21,
    lastActive: 'Yesterday',
    nextSession: 'Fri, Jun 27 · 10:00 AM',
    therapist: 'Dr. Emeka Nwosu',
    progress: 54,
  },
  {
    id: 'david',
    name: 'David',
    age: 11,
    condition: 'ASD · SLP',
    tags: ['DND'],
    avatar: '🧒',
    avatarBg: '#8E44AD',
    streak: 20,
    weeklyHours: 10,
    gamesPlayed: 67,
    lastActive: 'Today',
    nextSession: 'Mon, Jun 30 · 2:00 PM',
    therapist: 'Dr. Fatima Bello',
    progress: 91,
  },
]

export default function FamilyPage({ onBack, onSelectChild }: Props) {
  return (
    <div className="family-screen screen">
      {/* Header */}
      <div className="fm-header">
        <button className="fm-back" onClick={onBack}>←</button>
        <h1 className="fm-title">My Children</h1>
        <button className="fm-add" title="Add child">＋</button>
      </div>

      <div className="screen-scroll">
        <p className="fm-subtitle">Tap a child to view their full profile & progress</p>

        <div className="fm-children-list">
          {CHILDREN.map((child) => (
            <div
              key={child.id}
              className="fm-child-card"
              onClick={() => onSelectChild(child.id)}
            >
              {/* Avatar + basic info */}
              <div className="fm-child-top">
                <div
                  className="fm-child-avatar"
                  style={{ background: child.avatarBg }}
                >
                  <span>{child.avatar}</span>
                </div>
                <div className="fm-child-info">
                  <div className="fm-child-name-row">
                    <span className="fm-child-name">{child.name}</span>
                    <span className="fm-child-age">Age {child.age}</span>
                  </div>
                  <span className="fm-child-condition">{child.condition}</span>
                  <div className="fm-child-tags">
                    {child.tags.map((t) => (
                      <span key={t} className={`fm-tag fm-tag--${t.toLowerCase()}`}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="fm-child-arrow">›</div>
              </div>

              {/* Stats row */}
              <div className="fm-child-stats">
                <div className="fm-mini-stat">
                  <span className="fm-mini-val">🔥 {child.streak}</span>
                  <span className="fm-mini-label">Streak</span>
                </div>
                <div className="fm-mini-stat">
                  <span className="fm-mini-val">⏱ {child.weeklyHours}h</span>
                  <span className="fm-mini-label">This week</span>
                </div>
                <div className="fm-mini-stat">
                  <span className="fm-mini-val">🎮 {child.gamesPlayed}</span>
                  <span className="fm-mini-label">Sessions</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="fm-progress-row">
                <span className="fm-progress-label">Overall Progress</span>
                <span className="fm-progress-pct">{child.progress}%</span>
              </div>
              <div className="fm-progress-track">
                <div
                  className="fm-progress-fill"
                  style={{
                    width: `${child.progress}%`,
                    background: child.progress >= 80
                      ? '#2ECC71'
                      : child.progress >= 50
                        ? '#F5C518'
                        : '#E74C3C',
                  }}
                />
              </div>

              {/* Next session */}
              <div className="fm-next-session">
                <span className="fm-session-icon">📅</span>
                <span className="fm-session-text">
                  Next: <strong>{child.nextSession}</strong> · {child.therapist}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
