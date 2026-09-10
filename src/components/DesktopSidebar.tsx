import { useAccessibility } from '../context/AccessibilityContext'
import './DesktopSidebar.css'

interface Props {
  activeScreen: string
  userRole: 'caregiver' | 'student' | null
  onNavigate: (dest: string) => void
  onToggleRole: () => void
}

export default function DesktopSidebar({
  activeScreen,
  userRole,
  onNavigate,
  onToggleRole,
}: Props) {
  const { toggleModal, updateSetting } = useAccessibility()

  const navItems = [
    {
      id: userRole === 'student' ? 'student' : 'caregiver',
      label: 'Home Dashboard',
      icon: '🏠',
    },
    {
      id: 'games',
      label: 'Games Library',
      icon: '🎮',
    },
    {
      id: 'family',
      label: 'Family & Profiles',
      icon: '👨‍👩‍👧',
    },
  ]

  return (
    <aside className="desktop-sidebar">
      {/* Brand */}
      <div className="sidebar-brand" onClick={() => onNavigate('landing')}>
        <div className="sidebar-logo">
          <span className="logo-s">S</span>
          <span className="logo-n">N</span>
          <span className="logo-k">K</span>
          <span className="logo-feet">👣</span>
        </div>
        <span className="sidebar-tagline">Special Needs Kids</span>
      </div>

      {/* Profile Card */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {userRole === 'student' ? '👦' : '👩'}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">
            {userRole === 'student' ? 'Samuel' : 'Sandra M.'}
          </span>
          <span className="sidebar-user-role">
            {userRole === 'student' ? 'Student Account' : 'Caregiver Account'}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">MAIN NAVIGATION</span>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-nav-link ${
              activeScreen === item.id ? 'sidebar-nav-link--active' : ''
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-text">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Access Game */}
      <div className="sidebar-game-card" onClick={() => onNavigate('wordsplash')}>
        <div className="sidebar-game-icon">💦</div>
        <div className="sidebar-game-info">
          <span className="sidebar-game-title">Play WordSplash</span>
          <span className="sidebar-game-sub">5 Worlds available</span>
        </div>
        <button className="sidebar-game-play">▶</button>
      </div>

      {/* Footer Controls */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-action-btn sidebar-role-btn"
          onClick={onToggleRole}
        >
          🔄 Switch to {userRole === 'student' ? 'Caregiver' : 'Student'}
        </button>

        <button
          type="button"
          className="sidebar-action-btn sidebar-a11y-btn"
          onClick={toggleModal}
        >
          ♿ Sensory & Accessibility
        </button>

        <button
          type="button"
          className="sidebar-action-btn sidebar-layout-btn"
          onClick={() => updateSetting('layoutMode', 'phone')}
        >
          📱 Switch to Mobile View
        </button>
      </div>
    </aside>
  )
}
