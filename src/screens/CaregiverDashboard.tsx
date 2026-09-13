import { useState } from 'react'
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import BottomNav from '../components/BottomNav'
import TopBarHeader from '../components/TopBarHeader'
import SpeakButton from '../components/SpeakButton'
import { useAccessibility } from '../context/AccessibilityContext'
import { CHILDREN } from './FamilyPage'
import './CaregiverDashboard.css'

interface Props {
  onNavigate: (
    dest: 'games' | 'family' | 'student' | 'wordsplash' | 'child-profile',
    childId?: string
  ) => void
  onLogout: () => void
}

const tabs = ['Games', 'Weekly', 'Monthly'] as const
type Tab = typeof tabs[number]

// Analytics Datasets per Child
const childAnalytics = {
  samuel: {
    Games: [
      { name: 'WordSplash', value: 95, color: '#00D2D3', unit: 'min' },
      { name: 'Numbershark', value: 80, color: '#F5C518', unit: 'min' },
      { name: 'Detective Lonny', value: 60, color: '#8E44AD', unit: 'min' },
      { name: 'Jungle Adv.', value: 35, color: '#2ECC71', unit: 'min' },
    ],
    Weekly: [
      { name: 'Mon', value: 45, color: '#4A4FD4', unit: 'min' },
      { name: 'Tue', value: 60, color: '#4A4FD4', unit: 'min' },
      { name: 'Wed', value: 30, color: '#4A4FD4', unit: 'min' },
      { name: 'Thu', value: 55, color: '#4A4FD4', unit: 'min' },
      { name: 'Fri', value: 40, color: '#4A4FD4', unit: 'min' },
      { name: 'Sat', value: 25, color: '#4A4FD4', unit: 'min' },
      { name: 'Sun', value: 35, color: '#4A4FD4', unit: 'min' },
    ],
    Monthly: [
      { name: 'Phonics', value: 82, color: '#00D2D3', unit: '%' },
      { name: 'Memory', value: 74, color: '#F5C518', unit: '%' },
      { name: 'Focus Span', value: 68, color: '#2ECC71', unit: '%' },
      { name: 'Math Bonds', value: 60, color: '#E74C3C', unit: '%' },
    ],
    totalSessions: 14,
    totalHours: '4.8h',
    focusArea: 'Phonemic Awareness & Blending',
    targetMet: '92%',
  },
  grace: {
    Games: [
      { name: 'Numbershark', value: 90, color: '#F5C518', unit: 'min' },
      { name: 'Jungle Adv.', value: 65, color: '#2ECC71', unit: 'min' },
      { name: 'WordSplash', value: 35, color: '#00D2D3', unit: 'min' },
      { name: 'Detective Lonny', value: 20, color: '#8E44AD', unit: 'min' },
    ],
    Weekly: [
      { name: 'Mon', value: 20, color: '#F5C518', unit: 'min' },
      { name: 'Tue', value: 35, color: '#F5C518', unit: 'min' },
      { name: 'Wed', value: 15, color: '#F5C518', unit: 'min' },
      { name: 'Thu', value: 40, color: '#F5C518', unit: 'min' },
      { name: 'Fri', value: 30, color: '#F5C518', unit: 'min' },
      { name: 'Sat', value: 20, color: '#F5C518', unit: 'min' },
      { name: 'Sun', value: 25, color: '#F5C518', unit: 'min' },
    ],
    Monthly: [
      { name: 'Number Bonds', value: 65, color: '#F5C518', unit: '%' },
      { name: 'Visual Spatial', value: 78, color: '#2ECC71', unit: '%' },
      { name: 'Focus Span', value: 70, color: '#00D2D3', unit: '%' },
      { name: 'Pattern Rec', value: 62, color: '#8E44AD', unit: '%' },
    ],
    totalSessions: 8,
    totalHours: '3.1h',
    focusArea: 'Number Bonds to 10',
    targetMet: '85%',
  },
  david: {
    Games: [
      { name: 'Detective Lonny', value: 100, color: '#8E44AD', unit: 'min' },
      { name: 'Jungle Adv.', value: 85, color: '#2ECC71', unit: 'min' },
      { name: 'WordSplash', value: 75, color: '#00D2D3', unit: 'min' },
      { name: 'Numbershark', value: 40, color: '#F5C518', unit: 'min' },
    ],
    Weekly: [
      { name: 'Mon', value: 50, color: '#2ECC71', unit: 'min' },
      { name: 'Tue', value: 65, color: '#2ECC71', unit: 'min' },
      { name: 'Wed', value: 45, color: '#2ECC71', unit: 'min' },
      { name: 'Thu', value: 60, color: '#2ECC71', unit: 'min' },
      { name: 'Fri', value: 55, color: '#2ECC71', unit: 'min' },
      { name: 'Sat', value: 40, color: '#2ECC71', unit: 'min' },
      { name: 'Sun', value: 45, color: '#2ECC71', unit: 'min' },
    ],
    Monthly: [
      { name: 'Social Logic', value: 88, color: '#8E44AD', unit: '%' },
      { name: 'Speech Clarity', value: 84, color: '#00D2D3', unit: '%' },
      { name: 'Sensory Reg', value: 76, color: '#2ECC71', unit: '%' },
      { name: 'Reading', value: 90, color: '#4A4FD4', unit: '%' },
    ],
    totalSessions: 18,
    totalHours: '6.0h',
    focusArea: 'Social Interaction & Logic',
    targetMet: '96%',
  },
}

const therapistNotes = {
  samuel: {
    doctor: 'Dr. Amaka Obi',
    role: 'Pediatric Neuropsychologist',
    note: 'Samuel showed marked improvement in phonemic awareness this week. Continue WordSplash sessions 3x/week with focus on blend patterns.',
    date: 'Jun 20, 2026',
    recommendation: 'Recommend reducing screen breaks to every 20m as attention tolerance grows.',
    nextAppt: 'Thu, Jun 26 · 3:00 PM (Video)',
  },
  grace: {
    doctor: 'Dr. Emeka Nwosu',
    role: 'Special Education & Math Specialist',
    note: 'Grace is gaining great confidence with visual number bonds up to 10. Numbershark remains an ideal reinforcement game.',
    date: 'Jun 19, 2026',
    recommendation: 'Introduce simple multiplication concepts in next week’s session.',
    nextAppt: 'Fri, Jun 27 · 10:00 AM (Video)',
  },
  david: {
    doctor: 'Dr. Fatima Bello',
    role: 'Behavioral & Speech Pathologist',
    note: 'David consistently scores in the 90th percentile on social logic games. Carryover into verbal initiation at home is evident.',
    date: 'Jun 21, 2026',
    recommendation: 'Continue Detective Lonny scenarios and structured speech tasks.',
    nextAppt: 'Mon, Jun 30 · 2:00 PM (In-Person)',
  },
}

const conditionGuides = [
  {
    condition: 'Dyslexia (SLD - Reading)',
    icon: '📖',
    accent: '#4A4FD4',
    summary:
      'A learning difference affecting reading, spelling, and rapid word recognition.',
    tips: [
      'Use high-contrast text and OpenDyslexic / clean sans-serif typography.',
      'Encourage multisensory phonics games (auditory + visual cues like WordSplash).',
      'Celebrate progress in comprehension rather than speed.',
    ],
  },
  {
    condition: 'ADHD (Attention Deficit)',
    icon: '⚡',
    accent: '#F39C12',
    summary:
      'Characterized by executive function differences, high energy, and shorter focus windows.',
    tips: [
      'Break play sessions into 10–15 minute focused gamified sprints.',
      'Use immediate positive reinforcement and streak milestones.',
      'Minimize background visual clutter and loud sudden sound effects.',
    ],
  },
  {
    condition: 'Autism Spectrum (ASD)',
    icon: '🧩',
    accent: '#2ECC71',
    summary:
      'Involves unique social communication patterns, sensory sensitivities, and logical strengths.',
    tips: [
      'Maintain predictable routines and provide visual transition timers.',
      'Use games that simulate social cues and emotional problem-solving.',
      'Allow custom sensory volume and motion dampening controls.',
    ],
  },
  {
    condition: 'Dyscalculia (SLD - Math)',
    icon: '🔢',
    accent: '#E74C3C',
    summary:
      'A specific learning challenge with number concepts, quantities, and arithmetic facts.',
    tips: [
      'Use tactile visual blocks and visual dot patterns (Numbershark).',
      'Relate math problems to real-life objects (animals, coins, snacks).',
      'Provide ample processing time without timer-based pressure.',
    ],
  },
]

const notificationsData = [
  {
    id: 1,
    title: 'New Clinical Note Added',
    desc: 'Dr. Amaka Obi logged weekly evaluation for Samuel.',
    time: '2 hours ago',
    unread: true,
    icon: '🩺',
  },
  {
    id: 2,
    title: 'Streak Milestone Reached!',
    desc: 'Samuel has completed 5 consecutive daily learning days.',
    time: 'Yesterday',
    unread: true,
    icon: '🔥',
  },
  {
    id: 3,
    title: 'Upcoming Therapy Session',
    desc: 'Language Therapy with Dr. Amaka Obi on Thu, Jun 26 at 3:00 PM.',
    time: '2 days ago',
    unread: false,
    icon: '📅',
  },
  {
    id: 4,
    title: 'New Content Unlocked',
    desc: 'Level 4 Phonics in WordSplash is now available.',
    time: '3 days ago',
    unread: false,
    icon: '🎮',
  },
]

export default function CaregiverDashboard({ onNavigate, onLogout }: Props) {
  const [selectedChildId, setSelectedChildId] = useState<string>('samuel')
  const [activeTab, setActiveTab] = useState<Tab>('Games')
  const [activeNav, setActiveNav] = useState<'home' | 'games' | 'family'>('home')

  // Modals state
  const [showGamePlanModal, setShowGamePlanModal] = useState(false)
  const [showStreaksModal, setShowStreaksModal] = useState(false)
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [showNotifsModal, setShowNotifsModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Game Plan customizer form state
  const [dailyTarget, setDailyTarget] = useState<number>(30)
  const [assignedGames, setAssignedGames] = useState<string[]>([
    'wordsplash',
    'numbershark',
  ])
  const [sensoryCalmAudio, setSensoryCalmAudio] = useState(true)
  const [sensoryLowMotion, setSensoryLowMotion] = useState(false)

  const { activeLayout } = useAccessibility()

  const currentChild =
    CHILDREN.find((c) => c.id === selectedChildId) ?? CHILDREN[0]
  const analytics =
    childAnalytics[selectedChildId as keyof typeof childAnalytics] ??
    childAnalytics.samuel
  const therapistInfo =
    therapistNotes[selectedChildId as keyof typeof therapistNotes] ??
    therapistNotes.samuel
  const currentChartData = analytics[activeTab]

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const handleSaveGamePlan = () => {
    setShowGamePlanModal(false)
    triggerToast(`Game plan for ${currentChild.name} updated successfully!`)
  }

  const toggleGameAssignment = (gameId: string) => {
    if (assignedGames.includes(gameId)) {
      if (assignedGames.length > 1) {
        setAssignedGames(assignedGames.filter((g) => g !== gameId))
      }
    } else {
      setAssignedGames([...assignedGames, gameId])
    }
  }

  return (
    <div className="caregiver-screen screen">
      <TopBarHeader
        title="Caregiver Hub"
        speechText={`Welcome to the Caregiver Dashboard. Currently viewing ${currentChild.name}'s progress, therapy updates, and game plans.`}
      />

      {toastMessage && <div className="cg-toast-popup">{toastMessage}</div>}

      <div className="screen-scroll">
        {/* Top Caregiver Header with Bell */}
        <div className="cg-header">
          <div
            className="cg-avatar"
            onClick={() => onNavigate('child-profile', currentChild.id)}
            title="View full profile"
          >
            <div className="cg-avatar-child-badge">{currentChild.avatar}</div>
          </div>
          <div className="cg-header-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="cg-greeting">HEY, Sandra</span>
              <SpeakButton
                text={`Hey Sandra! You have active updates for ${currentChild.name}. ${currentChild.condition}.`}
                size="sm"
              />
            </div>
            <span className="cg-role">
              Managing <strong>{currentChild.name}</strong> ({currentChild.condition})
            </span>
          </div>
          <div className="cg-header-actions">
            <button
              className="cg-notif-btn"
              aria-label="Notifications"
              onClick={() => setShowNotifsModal(true)}
            >
              🔔
              <span className="cg-notif-badge">2</span>
            </button>
            <button
              className="cg-logout-btn"
              aria-label="Log out"
              onClick={onLogout}
              title="Log out"
            >
              ⏻
            </button>
          </div>
        </div>

        {/* Child Selector Carousel */}
        <div className="cg-child-selector-container">
          <div className="cg-child-selector-label">
            <span>Select Child:</span>
            <button
              className="cg-view-all-family-btn"
              onClick={() => onNavigate('family')}
            >
              All Profiles →
            </button>
          </div>
          <div className="cg-child-chips">
            {CHILDREN.map((child) => {
              const isSelected = child.id === selectedChildId
              return (
                <button
                  key={child.id}
                  className={`cg-child-chip ${isSelected ? 'cg-child-chip--active' : ''}`}
                  style={{
                    borderColor: isSelected ? child.avatarBg : 'transparent',
                  }}
                  onClick={() => setSelectedChildId(child.id)}
                >
                  <span
                    className="cg-chip-avatar"
                    style={{ background: child.avatarBg }}
                  >
                    {child.avatar}
                  </span>
                  <div className="cg-chip-info">
                    <span className="cg-chip-name">{child.name}</span>
                    <span className="cg-chip-age">
                      Age {child.age} · {child.tags[0]}
                    </span>
                  </div>
                  {isSelected && <span className="cg-chip-selected-dot">●</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dashboard Grid Container */}
        <div className="cg-grid-layout">
          {/* Column 1: Core Analytics & Action Center */}
          <div className="cg-grid-col-main">
            {/* Quick Action Cards */}
            <div className="cg-actions">
              <div
                className="cg-action-card cg-action-card--plan"
                onClick={() => setShowGamePlanModal(true)}
                role="button"
                tabIndex={0}
              >
                <div className="cg-action-header-row">
                  <span className="cg-action-icon">⚙️</span>
                  <span className="cg-action-badge">{dailyTarget} min/day</span>
                </div>
                <span className="cg-action-label">Customize Game Plan</span>
                <span className="cg-action-sub">
                  Target: {assignedGames.length} games assigned
                </span>
              </div>

              <div
                className="cg-action-card cg-action-card--streak"
                onClick={() => setShowStreaksModal(true)}
                role="button"
                tabIndex={0}
              >
                <div className="cg-action-header-row">
                  <span className="cg-action-icon">🔥</span>
                  <span className="cg-action-badge">{currentChild.streak} Days</span>
                </div>
                <span className="cg-action-label">Daily Streaks</span>
                <span className="cg-action-sub">
                  Top 10% consistency this month
                </span>
              </div>
            </div>

            {/* Dynamic Progress Chart */}
            <div className="cg-chart-card">
              <div className="cg-chart-header">
                <div className="cg-chart-title-group">
                  <div className="cg-chart-icon">📊</div>
                  <div>
                    <h3 className="cg-chart-heading">
                      {currentChild.name}'s Analytics
                    </h3>
                    <p className="cg-chart-subheading">
                      {activeTab === 'Games' && 'Playtime per educational game'}
                      {activeTab === 'Weekly' && 'Daily activity hours this week'}
                      {activeTab === 'Monthly' && 'Core cognitive & skill mastery'}
                    </p>
                  </div>
                </div>

                <div className="cg-chart-tabs">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      className={`cg-chart-tab ${
                        activeTab === t ? 'cg-chart-tab--active' : ''
                      }`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart KPI Metric Strip */}
              <div className="cg-chart-stats">
                <div className="cg-stat-box">
                  <span className="cg-stat-num">{analytics.totalHours}</span>
                  <span className="cg-stat-lbl">Active Time</span>
                </div>
                <div className="cg-stat-box">
                  <span className="cg-stat-num">{analytics.totalSessions}</span>
                  <span className="cg-stat-lbl">Sessions</span>
                </div>
                <div className="cg-stat-box">
                  <span className="cg-stat-num">{analytics.targetMet}</span>
                  <span className="cg-stat-lbl">Goal Met</span>
                </div>
              </div>

              {/* Chart Visualizer */}
              <div className="cg-chart-wrapper">
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={currentChartData} barCategoryGap="25%">
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide domain={[0, 'dataMax + 15']} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="cg-chart-tooltip">
                              <p className="cg-tooltip-title">{data.name}</p>
                              <p className="cg-tooltip-val">
                                {data.value} {data.unit}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                      {currentChartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                          fillOpacity={0.9}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Difficulties Guide Banner */}
            <div
              className="cg-info-banner"
              onClick={() => setShowGuideModal(true)}
              role="button"
              tabIndex={0}
            >
              <div className="cg-play-btn">💡</div>
              <div className="cg-info-text-group">
                <span className="cg-info-title">
                  UNDERSTANDING {currentChild.name.toUpperCase()}'S NEEDS
                </span>
                <span className="cg-info-subtitle">
                  Evidence-based guides & home strategies for {currentChild.condition}
                </span>
              </div>
              <div
                className="cg-info-speak-wrapper"
                onClick={(e) => e.stopPropagation()}
              >
                <SpeakButton
                  text={`Learn more about ${currentChild.name}'s diagnosis: ${currentChild.condition}. Tap to view tailored coping strategies.`}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Column 2: Clinical Insights & Recommended Actions */}
          <div className="cg-grid-col-side">
            {/* Therapist Insights Card */}
            <div className="cg-therapist-card">
              <div className="cg-card-top-row">
                <div className="cg-therapist-badge">
                  <span>🩺 Clinical Note</span>
                </div>
                <span className="cg-therapist-date">{therapistInfo.date}</span>
              </div>
              <div className="cg-therapist-profile">
                <div className="cg-therapist-avatar">👩‍⚕️</div>
                <div>
                  <h4 className="cg-therapist-name">{therapistInfo.doctor}</h4>
                  <p className="cg-therapist-role">{therapistInfo.role}</p>
                </div>
              </div>
              <p className="cg-therapist-quote">"{therapistInfo.note}"</p>
              <div className="cg-therapist-recom">
                <strong>💡 Tip:</strong> {therapistInfo.recommendation}
              </div>

              {/* Upcoming Appointment Row */}
              <div className="cg-appt-bar">
                <div className="cg-appt-info">
                  <span className="cg-appt-label">Next Session</span>
                  <span className="cg-appt-time">{therapistInfo.nextAppt}</span>
                </div>
                <button
                  className="cg-appt-btn"
                  onClick={() => onNavigate('child-profile', currentChild.id)}
                >
                  Details
                </button>
              </div>
            </div>

            {/* Recommended Games for Child */}
            <div className="cg-recommended-games-card">
              <div className="cg-card-title-row">
                <h4 className="cg-side-title">Targeted Learning Games</h4>
                <button
                  className="cg-see-all-btn"
                  onClick={() => onNavigate('games')}
                >
                  Library →
                </button>
              </div>

              <div className="cg-recom-games-list">
                {selectedChildId === 'samuel' ? (
                  <>
                    <div
                      className="cg-recom-game-item"
                      onClick={() => onNavigate('wordsplash')}
                    >
                      <span className="cg-game-badge-icon">🌊</span>
                      <div className="cg-game-item-details">
                        <span className="cg-game-item-title">WordSplash</span>
                        <span className="cg-game-item-tag">Phonics & Dyslexia</span>
                      </div>
                      <button className="cg-game-play-btn">Play</button>
                    </div>

                    <div
                      className="cg-recom-game-item"
                      onClick={() => onNavigate('games')}
                    >
                      <span className="cg-game-badge-icon">🦈</span>
                      <div className="cg-game-item-details">
                        <span className="cg-game-item-title">Numbershark</span>
                        <span className="cg-game-item-tag">Fast Number Bonds</span>
                      </div>
                      <button className="cg-game-play-btn">Play</button>
                    </div>
                  </>
                ) : selectedChildId === 'grace' ? (
                  <>
                    <div
                      className="cg-recom-game-item"
                      onClick={() => onNavigate('games')}
                    >
                      <span className="cg-game-badge-icon">🦈</span>
                      <div className="cg-game-item-details">
                        <span className="cg-game-item-title">Numbershark</span>
                        <span className="cg-game-item-tag">Math Visuals</span>
                      </div>
                      <button className="cg-game-play-btn">Play</button>
                    </div>

                    <div
                      className="cg-recom-game-item"
                      onClick={() => onNavigate('games')}
                    >
                      <span className="cg-game-badge-icon">🌴</span>
                      <div className="cg-game-item-details">
                        <span className="cg-game-item-title">Jungle Adventure</span>
                        <span className="cg-game-item-tag">Counting Sprints</span>
                      </div>
                      <button className="cg-game-play-btn">Play</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="cg-recom-game-item"
                      onClick={() => onNavigate('games')}
                    >
                      <span className="cg-game-badge-icon">🔍</span>
                      <div className="cg-game-item-details">
                        <span className="cg-game-item-title">Detective Lonny</span>
                        <span className="cg-game-item-tag">Social Logic & Cues</span>
                      </div>
                      <button className="cg-game-play-btn">Play</button>
                    </div>

                    <div
                      className="cg-recom-game-item"
                      onClick={() => onNavigate('wordsplash')}
                    >
                      <span className="cg-game-badge-icon">🌊</span>
                      <div className="cg-game-item-details">
                        <span className="cg-game-item-title">WordSplash</span>
                        <span className="cg-game-item-tag">Vocabulary Builder</span>
                      </div>
                      <button className="cg-game-play-btn">Play</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Switch to Student View Button */}
            <div className="cg-switch-row">
              <button
                className="cg-switch-btn"
                onClick={() => onNavigate('student')}
              >
                👦 Switch to {currentChild.name}'s Student View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Customize Game Plan */}
      {showGamePlanModal && (
        <div className="cg-modal-backdrop" onClick={() => setShowGamePlanModal(false)}>
          <div
            className="cg-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cg-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>⚙️</span>
                <div>
                  <h3 className="cg-modal-title">
                    Game Plan for {currentChild.name}
                  </h3>
                  <p className="cg-modal-subtitle">
                    Set daily playtime goals, focus games & sensory preferences
                  </p>
                </div>
              </div>
              <button
                className="cg-modal-close"
                onClick={() => setShowGamePlanModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="cg-modal-body">
              {/* Daily Target Slider */}
              <div className="cg-plan-section">
                <div className="cg-plan-label-row">
                  <label className="cg-plan-label">Daily Target Playtime</label>
                  <span className="cg-plan-value-badge">{dailyTarget} minutes</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(Number(e.target.value))}
                  className="cg-slider"
                />
                <div className="cg-slider-hints">
                  <span>10m (Sprint)</span>
                  <span>30m (Balanced)</span>
                  <span>60m (Max)</span>
                </div>
              </div>

              {/* Assign Focus Games */}
              <div className="cg-plan-section">
                <label className="cg-plan-label">Assigned Focus Games</label>
                <div className="cg-game-toggles">
                  {[
                    { id: 'wordsplash', name: 'WordSplash', tag: 'Phonics' },
                    { id: 'numbershark', name: 'Numbershark', tag: 'Math' },
                    { id: 'lonny', name: 'Detective Lonny', tag: 'Logic & Social' },
                    { id: 'jungle', name: 'Jungle Adventure', tag: 'Spatial' },
                  ].map((g) => {
                    const isChecked = assignedGames.includes(g.id)
                    return (
                      <div
                        key={g.id}
                        className={`cg-game-toggle-card ${
                          isChecked ? 'cg-game-toggle-card--active' : ''
                        }`}
                        onClick={() => toggleGameAssignment(g.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                        />
                        <div className="cg-game-toggle-info">
                          <span className="cg-game-toggle-name">{g.name}</span>
                          <span className="cg-game-toggle-tag">{g.tag}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sensory & Accessibility Settings */}
              <div className="cg-plan-section">
                <label className="cg-plan-label">Sensory Adaptations</label>
                <div className="cg-sensory-options">
                  <label className="cg-toggle-row">
                    <span>Calm Background Music & Soft Sound Effects</span>
                    <input
                      type="checkbox"
                      checked={sensoryCalmAudio}
                      onChange={(e) => setSensoryCalmAudio(e.target.checked)}
                    />
                  </label>
                  <label className="cg-toggle-row">
                    <span>Reduce High-Motion Animations</span>
                    <input
                      type="checkbox"
                      checked={sensoryLowMotion}
                      onChange={(e) => setSensoryLowMotion(e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="cg-modal-footer">
              <button
                className="cg-btn-secondary"
                onClick={() => setShowGamePlanModal(false)}
              >
                Cancel
              </button>
              <button className="cg-btn-primary" onClick={handleSaveGamePlan}>
                Save Game Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Streaks & Consistency */}
      {showStreaksModal && (
        <div className="cg-modal-backdrop" onClick={() => setShowStreaksModal(false)}>
          <div
            className="cg-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cg-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>🔥</span>
                <div>
                  <h3 className="cg-modal-title">
                    {currentChild.name}'s Learning Streak
                  </h3>
                  <p className="cg-modal-subtitle">
                    Tracking daily consistency and cognitive engagement
                  </p>
                </div>
              </div>
              <button
                className="cg-modal-close"
                onClick={() => setShowStreaksModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="cg-modal-body">
              <div className="cg-streak-hero-box">
                <span className="cg-streak-big-icon">🔥</span>
                <span className="cg-streak-big-count">{currentChild.streak} Days</span>
                <span className="cg-streak-hero-caption">
                  Active streak! Keep playing daily to unlock the 7-day Master Badge.
                </span>
              </div>

              {/* 7-Day Visual Tracker */}
              <div className="cg-streak-days-row">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const completed = idx < currentChild.streak
                  return (
                    <div key={day} className="cg-streak-day-item">
                      <div
                        className={`cg-streak-day-circle ${
                          completed ? 'cg-streak-day-circle--completed' : ''
                        }`}
                      >
                        {completed ? '✓' : idx + 1}
                      </div>
                      <span className="cg-streak-day-label">{day}</span>
                    </div>
                  )
                })}
              </div>

              {/* Milestones / Badges */}
              <h4 className="cg-badges-title">Unlocked Badges</h4>
              <div className="cg-badges-grid">
                <div className="cg-badge-item cg-badge-item--unlocked">
                  <span className="cg-badge-icon">🌟</span>
                  <span className="cg-badge-name">3-Day Spark</span>
                  <span className="cg-badge-desc">Unlocked</span>
                </div>
                <div className="cg-badge-item cg-badge-item--unlocked">
                  <span className="cg-badge-icon">⚡</span>
                  <span className="cg-badge-name">5-Day Flash</span>
                  <span className="cg-badge-desc">Unlocked</span>
                </div>
                <div className="cg-badge-item">
                  <span className="cg-badge-icon">🏆</span>
                  <span className="cg-badge-name">7-Day Titan</span>
                  <span className="cg-badge-desc">2 days left</span>
                </div>
              </div>
            </div>

            <div className="cg-modal-footer">
              <button
                className="cg-btn-primary"
                onClick={() => setShowStreaksModal(false)}
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Difficulties & Condition Guides */}
      {showGuideModal && (
        <div className="cg-modal-backdrop" onClick={() => setShowGuideModal(false)}>
          <div
            className="cg-modal-dialog cg-modal-dialog--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cg-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>💡</span>
                <div>
                  <h3 className="cg-modal-title">Special Needs & Condition Guide</h3>
                  <p className="cg-modal-subtitle">
                    Evidence-based parenting advice, cognitive insights & accommodations
                  </p>
                </div>
              </div>
              <button
                className="cg-modal-close"
                onClick={() => setShowGuideModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="cg-modal-body">
              <div className="cg-guide-list">
                {conditionGuides.map((guide) => (
                  <div
                    key={guide.condition}
                    className="cg-guide-card"
                    style={{ borderLeftColor: guide.accent }}
                  >
                    <div className="cg-guide-header">
                      <span className="cg-guide-icon">{guide.icon}</span>
                      <h4 className="cg-guide-name">{guide.condition}</h4>
                      <SpeakButton
                        text={`${guide.condition}. ${guide.summary}. Strategies: ${guide.tips.join('. ')}`}
                        size="sm"
                      />
                    </div>
                    <p className="cg-guide-summary">{guide.summary}</p>
                    <ul className="cg-guide-tips">
                      {guide.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="cg-modal-footer">
              <button
                className="cg-btn-primary"
                onClick={() => setShowGuideModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Notifications Drawer */}
      {showNotifsModal && (
        <div className="cg-modal-backdrop" onClick={() => setShowNotifsModal(false)}>
          <div
            className="cg-modal-dialog cg-modal-dialog--drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cg-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>🔔</span>
                <h3 className="cg-modal-title">Notifications & Updates</h3>
              </div>
              <button
                className="cg-modal-close"
                onClick={() => setShowNotifsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="cg-modal-body">
              <div className="cg-notifs-list">
                {notificationsData.map((n) => (
                  <div
                    key={n.id}
                    className={`cg-notif-item ${n.unread ? 'cg-notif-item--unread' : ''}`}
                  >
                    <span className="cg-notif-item-icon">{n.icon}</span>
                    <div className="cg-notif-item-content">
                      <div className="cg-notif-item-top">
                        <span className="cg-notif-item-title">{n.title}</span>
                        <span className="cg-notif-item-time">{n.time}</span>
                      </div>
                      <p className="cg-notif-item-desc">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cg-modal-footer">
              <button
                className="cg-btn-secondary"
                onClick={() => {
                  triggerToast('All notifications marked as read.')
                  setShowNotifsModal(false)
                }}
              >
                Mark all as read
              </button>
              <button
                className="cg-btn-primary"
                onClick={() => setShowNotifsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {activeLayout === 'phone' && (
        <BottomNav
          active={activeNav}
          onNavigate={(n) => {
            setActiveNav(n)
            if (n === 'games') onNavigate('games')
            else if (n === 'family') onNavigate('family')
          }}
        />
      )}
    </div>
  )
}
