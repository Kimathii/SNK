import { useState } from 'react'
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts'
import BottomNav from '../components/BottomNav'
import './CaregiverDashboard.css'

interface Props {
  onSwitchToStudent: () => void
}

const gameData = [
  { name: 'Numbershark', value: 100, color: '#4A4FD4' },
  { name: 'Wordsplash', value: 50, color: '#6B70E8' },
  { name: 'Detective\nLonny', value: 70, color: '#4A4FD4' },
  { name: 'Jungle\nAdventure', value: 30, color: '#6B70E8' },
]

const tabs = ['Games', 'Weekly', 'Monthly'] as const
type Tab = typeof tabs[number]

export default function CaregiverDashboard({ onSwitchToStudent }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Games')
  const [activeNav, setActiveNav] = useState<'home' | 'games' | 'family'>('home')

  return (
    <div className="caregiver-screen screen">
      <div className="screen-scroll">
        {/* Header */}
        <div className="cg-header">
          <div className="cg-avatar">
            <svg viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="30" fill="#E74C3C" />
              <circle cx="30" cy="22" r="10" fill="#FDBCB4" />
              <ellipse cx="30" cy="50" rx="16" ry="14" fill="#F39C12" />
              <path d="M18 24 Q14 16 20 14 Q24 8 30 10 Q38 8 40 14 Q46 16 42 24" fill="#2C1B12" />
              <path d="M42 22 Q46 18 44 28" stroke="#FDBCB4" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="cg-header-text">
            <span className="cg-greeting">HEY, Audrey</span>
            <span className="cg-role">Caregiver</span>
          </div>
          <button className="cg-notif" aria-label="Notifications">🔔</button>
        </div>

        {/* Quick actions */}
        <div className="cg-actions">
          <div className="cg-action-card">
            <span className="cg-action-icon">⚙️</span>
            <span className="cg-action-label">Customize game plan</span>
          </div>
          <div className="cg-action-card">
            <span className="cg-action-icon">🔥</span>
            <span className="cg-action-label">Daily streaks</span>
          </div>
        </div>

        {/* Progress chart */}
        <div className="cg-section-title">Progress chart</div>
        <div className="cg-chart-card">
          <div className="cg-chart-header">
            <div className="cg-chart-icon">📊</div>
            <div className="cg-chart-tabs">
              {tabs.map((t) => (
                <button
                  key={t}
                  className={`cg-chart-tab ${activeTab === t ? 'cg-chart-tab--active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="cg-chart-stats">
            <span className="cg-stat"><strong>12</strong> Games</span>
            <span className="cg-stat"><strong>7</strong> Hours</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={gameData} barCategoryGap="28%">
              <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                {gameData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.85 + (index % 2) * 0.15} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="cg-chart-labels">
            {gameData.map((d) => (
              <span key={d.name} className="cg-chart-label">{d.name}</span>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className="cg-info-banner">
          <div className="cg-play-btn">▶</div>
          <span className="cg-info-text">KNOW MORE ABOUT YOU CHILD DIFFICULTIES</span>
        </div>

        {/* Know more about games */}
        <div className="cg-games-row">
          <div className="cg-games-icons">
            <span className="cg-game-chip">🦊</span>
            <span className="cg-game-chip">📝</span>
          </div>
          <button className="cg-games-cta">Know more about games</button>
        </div>

        {/* Switch to student view */}
        <div className="cg-switch-row">
          <button className="cg-switch-btn" onClick={onSwitchToStudent}>
            👦 Switch to Student View
          </button>
        </div>
      </div>

      <BottomNav active={activeNav} onNavigate={(n) => {
        setActiveNav(n)
        if (n === 'family') onSwitchToStudent()
      }} />
    </div>
  )
}
