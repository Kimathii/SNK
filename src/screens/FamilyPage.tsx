import { useState } from 'react'
import TopBarHeader from '../components/TopBarHeader'
import SpeakButton from '../components/SpeakButton'
import './FamilyPage.css'

export interface Child {
  id: string
  name: string
  age: number
  condition: string
  avatar: string
  avatarBg: string
  streak: number
  weeklyHours: number
  gamesPlayed: number
  nextSession: string
  progress: number
  therapist: string
  tags: string[]
}

export const CHILDREN: Child[] = [
  {
    id: 'samuel',
    name: 'Samuel',
    age: 7,
    condition: 'Dyslexia & ADHD',
    avatar: '👦',
    avatarBg: '#4A4FD4',
    streak: 5,
    weeklyHours: 3.5,
    gamesPlayed: 42,
    nextSession: 'Thu, Jun 26 · 3:00 PM',
    progress: 72,
    therapist: 'Dr. Amaka Obi',
    tags: ['SLD', 'DND', 'Phonics'],
  },
  {
    id: 'grace',
    name: 'Grace',
    age: 5,
    condition: 'Dyscalculia',
    avatar: '👧',
    avatarBg: '#F5C518',
    streak: 3,
    weeklyHours: 2.0,
    gamesPlayed: 21,
    nextSession: 'Fri, Jun 27 · 10:00 AM',
    progress: 58,
    therapist: 'Dr. Emeka Nwosu',
    tags: ['SLD', 'Numbers'],
  },
  {
    id: 'david',
    name: 'David',
    age: 9,
    condition: 'Autism Spectrum (ASD)',
    avatar: '🧒',
    avatarBg: '#2ECC71',
    streak: 8,
    weeklyHours: 4.8,
    gamesPlayed: 67,
    nextSession: 'Mon, Jun 30 · 2:00 PM',
    progress: 89,
    therapist: 'Dr. Fatima Bello',
    tags: ['DND', 'Speech', 'Logic'],
  },
]

interface Props {
  onBack: () => void
  onSelectChild: (childId: string) => void
}

export default function FamilyPage({ onBack, onSelectChild }: Props) {
  const [activeCondition, setActiveCondition] = useState<string>('All')

  const filtered = CHILDREN.filter(
    (c) => activeCondition === 'All' || c.tags.includes(activeCondition)
  )

  return (
    <div className="family-screen screen">
      <TopBarHeader
        title="Family Hub"
        showBack={true}
        onBack={onBack}
        speechText="Welcome to the Family Hub! Manage your children's profiles, track milestones, and view therapist reports."
      />

      <div className="screen-scroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px' }}>
          <p className="fm-subtitle">Tap a child to view their full profile & progress</p>
          <SpeakButton text="Tap a child to view their full profile and progress" />
        </div>

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
