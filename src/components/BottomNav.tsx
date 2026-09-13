import './BottomNav.css'

type NavItem = 'home' | 'games' | 'family'

interface Props {
  active: NavItem
  onNavigate: (item: NavItem) => void
}

export default function BottomNav({ active, onNavigate }: Props) {
  const items: { id: NavItem; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  ]

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav__pill">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav__item ${active === item.id ? 'bottom-nav__item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={active === item.id ? 'page' : undefined}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
          </button>
        ))}
      </div>
      {/* Home indicator bar */}
      <div className="bottom-nav__bar" />
    </nav>
  )
}
