import { useState } from 'react'
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts'
import { CHILDREN } from './FamilyPage'
import TopBarHeader from '../components/TopBarHeader'
import SpeakButton from '../components/SpeakButton'
import './ChildProfile.css'

interface Props {
  childId: string
  onBack: () => void
}

const weeklyData = {
  samuel: [
    { day: 'Mon', value: 60 },
    { day: 'Tue', value: 90 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 100 },
    { day: 'Fri', value: 75 },
    { day: 'Sat', value: 30 },
    { day: 'Sun', value: 50 },
  ],
  grace: [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 55 },
    { day: 'Wed', value: 20 },
    { day: 'Thu', value: 70 },
    { day: 'Fri', value: 45 },
    { day: 'Sat', value: 60 },
    { day: 'Sun', value: 30 },
  ],
  david: [
    { day: 'Mon', value: 80 },
    { day: 'Tue', value: 100 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 85 },
    { day: 'Fri', value: 95 },
    { day: 'Sat', value: 70 },
    { day: 'Sun', value: 60 },
  ],
}

const sessionHistory = {
  samuel: [
    { date: 'Jun 20', type: 'Game', name: 'Numbershark', duration: '35 min', score: 92 },
    { date: 'Jun 20', type: 'Therapy', name: 'Language Session', duration: '50 min', score: null },
    { date: 'Jun 18', type: 'Game', name: 'Wordsplash', duration: '20 min', score: 78 },
    { date: 'Jun 17', type: 'Therapy', name: 'Cognitive Exercises', duration: '45 min', score: null },
    { date: 'Jun 15', type: 'Game', name: 'Detective Lonny', duration: '30 min', score: 85 },
  ],
  grace: [
    { date: 'Jun 21', type: 'Game', name: 'Numbershark', duration: '25 min', score: 68 },
    { date: 'Jun 19', type: 'Therapy', name: 'Math Therapy', duration: '40 min', score: null },
    { date: 'Jun 17', type: 'Game', name: 'Jungle Adventure', duration: '20 min', score: 74 },
  ],
  david: [
    { date: 'Jun 22', type: 'Game', name: 'Detective Lonny', duration: '40 min', score: 95 },
    { date: 'Jun 21', type: 'Therapy', name: 'Social Skills', duration: '60 min', score: null },
    { date: 'Jun 20', type: 'Game', name: 'Jungle Adventure', duration: '35 min', score: 89 },
    { date: 'Jun 18', type: 'Therapy', name: 'Speech Session', duration: '45 min', score: null },
    { date: 'Jun 16', type: 'Game', name: 'Wordsplash', duration: '28 min', score: 91 },
  ],
}

const therapistNotes = {
  samuel: [
    {
      date: 'Jun 20',
      therapist: 'Dr. Amaka Obi',
      note: 'Samuel showed marked improvement in phonemic awareness this week. Continue Wordsplash sessions 3x/week. Focus on blending exercises in next session.',
    },
    {
      date: 'Jun 13',
      therapist: 'Dr. Amaka Obi',
      note: 'Concentration span improved from 8 to 14 minutes. Recommend reducing screen breaks to every 20 minutes as tolerance grows.',
    },
  ],
  grace: [
    {
      date: 'Jun 19',
      therapist: 'Dr. Emeka Nwosu',
      note: 'Grace is gaining confidence with number bonds up to 10. Numbershark is an excellent reinforcement tool. Introduce multiplication concepts next week.',
    },
  ],
  david: [
    {
      date: 'Jun 21',
      therapist: 'Dr. Fatima Bello',
      note: 'David consistently scores in the 90th percentile on logic games. Social interaction simulations in Detective Lonny are showing real-world carryover. Excellent progress.',
    },
    {
      date: 'Jun 14',
      therapist: 'Dr. Fatima Bello',
      note: 'Speech clarity improved significantly. Continue current therapy plan. Parents report increased verbal initiation at home — very positive sign.',
    },
  ],
}

const upcomingAppointments = {
  samuel: [
    { date: 'Thu, Jun 26', time: '3:00 PM', therapist: 'Dr. Amaka Obi', type: 'Language Therapy', mode: 'Video' },
    { date: 'Mon, Jun 30', time: '4:00 PM', therapist: 'Dr. Amaka Obi', type: 'Cognitive Session', mode: 'In-Person' },
  ],
  grace: [
    { date: 'Fri, Jun 27', time: '10:00 AM', therapist: 'Dr. Emeka Nwosu', type: 'Math Therapy', mode: 'Video' },
  ],
  david: [
    { date: 'Mon, Jun 30', time: '2:00 PM', therapist: 'Dr. Fatima Bello', type: 'Social Skills', mode: 'In-Person' },
    { date: 'Wed, Jul 2', time: '11:00 AM', therapist: 'Dr. Fatima Bello', type: 'Speech Session', mode: 'Video' },
  ],
}

type TabId = 'overview' | 'sessions' | 'notes' | 'appointments'
const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'notes', label: 'Notes' },
  { id: 'appointments', label: 'Upcoming' },
]

export default function ChildProfile({ childId, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const child = CHILDREN.find((c) => c.id === childId) ?? CHILDREN[0]
  const data = weeklyData[childId as keyof typeof weeklyData] ?? weeklyData.samuel
  const sessions = sessionHistory[childId as keyof typeof sessionHistory] ?? []
  const notes = therapistNotes[childId as keyof typeof therapistNotes] ?? []
  const appointments = upcomingAppointments[childId as keyof typeof upcomingAppointments] ?? []

  return (
    <div className="cp-screen screen">
      <TopBarHeader
        title={`${child.name}'s Profile`}
        showBack={true}
        onBack={onBack}
        speechText={`This is ${child.name}'s profile. Age ${child.age}, ${child.condition}. Therapist is ${child.therapist}.`}
      />
      {/* Hero header */}
      <div className="cp-hero" style={{ background: child.avatarBg }}>
        <button className="cp-back" onClick={onBack}>← Back</button>
        <div className="cp-hero-avatar">{child.avatar}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <h1 className="cp-hero-name">{child.name}</h1>
          <SpeakButton text={`${child.name}. Age ${child.age}. Condition: ${child.condition}.`} size="sm" />
        </div>
        <p className="cp-hero-meta">Age {child.age} · {child.condition}</p>
        <div className="cp-hero-tags">
          {child.tags.map((t) => (
            <span key={t} className="cp-tag">{t}</span>
          ))}
        </div>
        {/* Quick stats */}
        <div className="cp-hero-stats">
          <div className="cp-hero-stat">
            <span className="cp-hero-stat-val">🔥 {child.streak}</span>
            <span className="cp-hero-stat-label">Day Streak</span>
          </div>
          <div className="cp-hero-stat-divider" />
          <div className="cp-hero-stat">
            <span className="cp-hero-stat-val">⏱ {child.weeklyHours}h</span>
            <span className="cp-hero-stat-label">This Week</span>
          </div>
          <div className="cp-hero-stat-divider" />
          <div className="cp-hero-stat">
            <span className="cp-hero-stat-val">{child.progress}%</span>
            <span className="cp-hero-stat-label">Progress</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cp-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`cp-tab ${activeTab === t.id ? 'cp-tab--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="screen-scroll cp-body">

        {activeTab === 'overview' && (
          <div className="cp-tab-content">
            {/* Weekly chart */}
            <div className="cp-card">
              <p className="cp-card-title">Weekly Activity</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={data} barCategoryGap="30%">
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#aaa', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={i === 3 ? child.avatarBg : '#E8E8E8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Progress breakdown */}
            <div className="cp-card">
              <p className="cp-card-title">Progress Breakdown</p>
              <div className="cp-progress-list">
                {[
                  { label: 'Reading & Language', value: child.id === 'samuel' ? 82 : child.id === 'grace' ? 45 : 88, color: '#4A4FD4' },
                  { label: 'Math & Numbers', value: child.id === 'samuel' ? 70 : child.id === 'grace' ? 60 : 75, color: '#F5C518' },
                  { label: 'Focus & Attention', value: child.id === 'samuel' ? 75 : child.id === 'grace' ? 58 : 95, color: '#2ECC71' },
                  { label: 'Problem Solving', value: child.id === 'samuel' ? 80 : child.id === 'grace' ? 52 : 94, color: '#8E44AD' },
                ].map((item) => (
                  <div key={item.label} className="cp-prog-item">
                    <div className="cp-prog-row">
                      <span className="cp-prog-label">{item.label}</span>
                      <span className="cp-prog-val">{item.value}%</span>
                    </div>
                    <div className="cp-prog-track">
                      <div className="cp-prog-fill" style={{ width: `${item.value}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Therapist */}
            <div className="cp-card cp-therapist-card">
              <p className="cp-card-title">Current Therapist</p>
              <div className="cp-therapist-row">
                <div className="cp-therapist-avatar">🩺</div>
                <div>
                  <p className="cp-therapist-name">{child.therapist}</p>
                  <p className="cp-therapist-spec">Special Needs Specialist</p>
                </div>
                <button className="cp-contact-btn">Contact</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="cp-tab-content">
            <p className="cp-tab-desc">All game and therapy sessions, newest first.</p>
            {sessions.map((s, i) => (
              <div key={i} className="cp-session-card">
                <div className={`cp-session-type-dot cp-session-type-dot--${s.type.toLowerCase()}`} />
                <div className="cp-session-body">
                  <div className="cp-session-top">
                    <span className="cp-session-name">{s.name}</span>
                    <span className={`cp-session-badge cp-session-badge--${s.type.toLowerCase()}`}>{s.type}</span>
                  </div>
                  <div className="cp-session-meta">
                    <span>📅 {s.date}</span>
                    <span>⏱ {s.duration}</span>
                    {s.score !== null && <span>⭐ Score: {s.score}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="cp-tab-content">
            <p className="cp-tab-desc">Notes from {child.therapist}.</p>
            {notes.map((n, i) => (
              <div key={i} className="cp-note-card">
                <div className="cp-note-header">
                  <span className="cp-note-therapist">{n.therapist}</span>
                  <span className="cp-note-date">{n.date}</span>
                </div>
                <p className="cp-note-text">{n.note}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="cp-tab-content">
            <p className="cp-tab-desc">Upcoming therapy sessions.</p>
            {appointments.map((a, i) => (
              <div key={i} className="cp-appt-card">
                <div className="cp-appt-date-block">
                  <span className="cp-appt-day">{a.date.split(',')[0]}</span>
                  <span className="cp-appt-month">{a.date.split(' ').slice(1).join(' ')}</span>
                </div>
                <div className="cp-appt-info">
                  <p className="cp-appt-type">{a.type}</p>
                  <p className="cp-appt-therapist">{a.therapist}</p>
                  <div className="cp-appt-meta-row">
                    <span className="cp-appt-time">🕐 {a.time}</span>
                    <span className={`cp-appt-mode cp-appt-mode--${a.mode.toLowerCase().replace('-','')}`}>
                      {a.mode === 'Video' ? '📹' : '🏥'} {a.mode}
                    </span>
                  </div>
                </div>
                <button className="cp-appt-btn">Join</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
