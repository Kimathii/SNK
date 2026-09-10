import TopBarHeader from '../components/TopBarHeader'
import SpeakButton from '../components/SpeakButton'
import './LandingPage.css'

interface Props {
  onSignUp: () => void
  onLogin: () => void
}

const features = [
  {
    icon: '🎮',
    title: 'Therapeutic Games',
    desc: 'Evidence-based games designed for children with SLD, ADHD, ASD and more — built with child psychologists.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    desc: 'Real-time dashboards so caregivers always know where their child stands — week by week.',
  },
  {
    icon: '🩺',
    title: 'Therapy Sessions',
    desc: 'Connect with certified therapists and schedule sessions directly inside the app.',
    soon: true,
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Family-Centered',
    desc: 'One account for the whole family. Separate views for caregivers and each child.',
  },
]

export default function LandingPage({ onSignUp, onLogin }: Props) {
  return (
    <div className="landing-screen screen">
      <TopBarHeader
        title="SNK Learning Platform"
        speechText="Welcome to SNK. The all-in-one sensory-friendly learning platform for children with special needs."
      />
      <div className="screen-scroll">

        {/* Nav bar */}
        <div className="lp-nav">
          <div className="lp-logo">
            <span className="lp-logo-s">S</span>
            <span className="lp-logo-n">N</span>
            <span className="lp-logo-k">K</span>
            <span className="lp-logo-feet">👣</span>
          </div>
          <button className="lp-login-link" onClick={onLogin}>Log in</button>
        </div>

        {/* Hero */}
        <div className="lp-hero">
          <div className="lp-hero-badge">🏅 Trusted by 10,000+ families</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <h1 className="lp-hero-title">
              Every Child<br />
              <span className="lp-hero-highlight">Deserves to Thrive</span>
            </h1>
            <SpeakButton text="Every child deserves to thrive. SNK is the all in one platform for special needs kids." size="md" />
          </div>
          <p className="lp-hero-sub">
            SNK is the all-in-one platform for special needs kids — therapeutic games, progress tracking, and therapist access in one place.
          </p>
          <button className="lp-cta-primary" onClick={onSignUp}>
            Get Started Free →
          </button>
          <p className="lp-hero-note">No credit card required · Takes 2 minutes</p>
        </div>

        {/* Floating stats strip */}
        <div className="lp-stats">
          <div className="lp-stat">
            <span className="lp-stat-num">10K+</span>
            <span className="lp-stat-label">Families</span>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <span className="lp-stat-num">4</span>
            <span className="lp-stat-label">Game Types</span>
          </div>
          <div className="lp-stat-divider" />
          <div className="lp-stat">
            <span className="lp-stat-num">SLD</span>
            <span className="lp-stat-label">& DND Support</span>
          </div>
        </div>

        {/* Who it's for */}
        <div className="lp-section">
          <p className="lp-section-eyebrow">WHO IT'S FOR</p>
          <h2 className="lp-section-title">Built for real families navigating real challenges</h2>
          <div className="lp-conditions">
            {['Dyslexia', 'Dyscalculia', 'Dysgraphia', 'ADHD', 'ASD', 'SLP'].map((c) => (
              <span key={c} className="lp-condition-chip">{c}</span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="lp-section">
          <p className="lp-section-eyebrow">WHAT WE OFFER</p>
          <h2 className="lp-section-title">Everything in one place</h2>
          <div className="lp-features">
            {features.map((f) => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <div className="lp-feature-body">
                  <div className="lp-feature-title-row">
                    <span className="lp-feature-title">{f.title}</span>
                    {f.soon && <span className="lp-soon-badge">Coming Soon</span>}
                  </div>
                  <p className="lp-feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Therapy teaser */}
        <div className="lp-therapy-banner">
          <div className="lp-therapy-inner">
            <span className="lp-therapy-icon">🩺</span>
            <div>
              <p className="lp-therapy-title">Therapy Area — Coming Soon</p>
              <p className="lp-therapy-sub">Book sessions with certified therapists who specialize in special needs children — right inside SNK.</p>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="lp-section">
          <p className="lp-section-eyebrow">WHAT PARENTS SAY</p>
          <div className="lp-testimonials">
            <div className="lp-testimonial">
              <p className="lp-testimonial-text">"Samuel went from dreading reading to asking to play Wordsplash every evening. SNK changed our lives."</p>
              <span className="lp-testimonial-author">— Sandra M., Lagos</span>
            </div>
            <div className="lp-testimonial">
              <p className="lp-testimonial-text">"The progress charts help me have real conversations with his school. I finally feel informed."</p>
              <span className="lp-testimonial-author">— Chidi O., Abuja</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="lp-final-cta">
          <h2>Ready to start?</h2>
          <p>Join thousands of families already using SNK.</p>
          <button className="lp-cta-primary" onClick={onSignUp}>
            Create Free Account
          </button>
          <button className="lp-cta-secondary" onClick={onLogin}>
            I already have an account
          </button>
        </div>

        <div className="lp-footer">
          <span>© 2026 SNK. All rights reserved.</span>
        </div>
      </div>
    </div>
  )
}
