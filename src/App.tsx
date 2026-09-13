import { useCallback, useEffect, useState } from 'react'
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext'
import AccessibilityModal from './components/AccessibilityModal'
import DesktopSidebar from './components/DesktopSidebar'
import BottomNav from './components/BottomNav'
import LandingPage from './screens/LandingPage'
import SplashScreen from './screens/SplashScreen'
import SignUpScreen from './screens/SignUpScreen'
import StruggleScreen from './screens/StruggleScreen'
import CongratulationsScreen from './screens/CongratulationsScreen'
import CaregiverDashboard from './screens/CaregiverDashboard'
import StudentDashboard from './screens/StudentDashboard'
import GamesLibrary from './screens/GamesLibrary'
import FamilyPage from './screens/FamilyPage'
import ChildProfile from './screens/ChildProfile'
import WordSplashGame from './games/wordsplash/WordSplashGame'

export type Screen =
  | 'landing'
  | 'splash'
  | 'signup'
  | 'login'
  | 'struggle'
  | 'congratulations'
  | 'caregiver'
  | 'student'
  | 'games'
  | 'family'
  | 'child-profile'
  | 'wordsplash'

export type UserRole = 'caregiver' | 'student' | null

export interface AppState {
  selectedStruggle: string | null
  userRole: UserRole
  selectedChildId: string | null
}

const SCREEN_PATHS: Record<Screen, string> = {
  landing: '/', splash: '/welcome', signup: '/signup', login: '/login',
  struggle: '/learning-needs', congratulations: '/ready',
  caregiver: '/caregiver', student: '/student', games: '/games',
  family: '/family', 'child-profile': '/child-profile', wordsplash: '/wordsplash',
}

function screenFromLocation(): Screen {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  return (Object.keys(SCREEN_PATHS) as Screen[]).find(screen => SCREEN_PATHS[screen] === path) ?? 'landing'
}

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(screenFromLocation)
  const [appState, setAppState] = useState<AppState>({
    selectedStruggle: null,
    userRole: screenFromLocation() === 'student' ? 'student' : null,
    selectedChildId: null,
  })

  const { activeLayout } = useAccessibility()

  const navigate = useCallback((screen: Screen, replace = false) => {
    const path = SCREEN_PATHS[screen]
    if (window.location.pathname + window.location.search + window.location.hash !== path) {
      if (replace) window.history.replaceState(null, '', path)
      else window.history.pushState(null, '', path)
    }
    setCurrentScreen(screen)
    if (screen === 'student' || screen === 'caregiver') {
      setAppState(state => ({ ...state, userRole: screen }))
    }
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const screen = screenFromLocation()
      setCurrentScreen(screen)
      if (screen === 'student' || screen === 'caregiver') {
        setAppState(state => ({ ...state, userRole: screen }))
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const anchor = currentScreen === 'landing' && window.location.hash
        ? document.getElementById(window.location.hash.slice(1)) : null
      if (anchor) anchor.scrollIntoView()
      else document.querySelectorAll('.desktop-content-body, .screen-scroll, .auth-screen')
        .forEach(element => { element.scrollTop = 0 })
    })
    return () => cancelAnimationFrame(frame)
  }, [currentScreen])

  const homeScreen = appState.userRole === 'student' ? 'student' : 'caregiver'

  const handlePlayGame = (gameId: string) => {
    if (gameId === 'wordsplash') {
      navigate('wordsplash')
    }
  }

  const handleToggleRole = () => {
    const nextRole: UserRole = appState.userRole === 'student' ? 'caregiver' : 'student'
    setAppState((s) => ({ ...s, userRole: nextRole }))
    navigate(nextRole)
  }

  const isDesktop = activeLayout === 'desktop'
  const isAuthScreen = [
    'landing',
    'splash',
    'signup',
    'login',
    'struggle',
    'congratulations',
  ].includes(currentScreen)
  const isGameActive = currentScreen === 'wordsplash'

  // Show desktop sidebar only when user is logged in (dashboard screens) and not playing a full-screen game
  const showSidebar = isDesktop && !isAuthScreen && !isGameActive

  const renderActiveScreen = () => {
    return (
      <>
        {currentScreen === 'landing' && (
          <LandingPage
            onSignUp={() => navigate('splash')}
            onLogin={() => navigate('login')}
          />
        )}

        {currentScreen === 'splash' && (
          <SplashScreen onNext={() => navigate('signup', true)} />
        )}

        {(currentScreen === 'signup' || currentScreen === 'login') && (
          <SignUpScreen
            key={currentScreen}
            mode={currentScreen}
            onBack={() => navigate('landing')}
            onModeChange={() => navigate(currentScreen === 'signup' ? 'login' : 'signup')}
            onContinue={(role: UserRole) => {
              setAppState((s) => ({ ...s, userRole: role }))
              navigate(currentScreen === 'login' ? (role === 'student' ? 'student' : 'caregiver') : 'struggle')
            }}
          />
        )}

        {currentScreen === 'struggle' && (
          <StruggleScreen
            onBack={() => navigate('signup')}
            onSelect={(struggle: string) => {
              setAppState((s) => ({ ...s, selectedStruggle: struggle }))
              navigate('congratulations')
            }}
          />
        )}

        {currentScreen === 'congratulations' && (
          <CongratulationsScreen
            onContinue={() =>
              navigate(appState.userRole === 'student' ? 'student' : 'caregiver')
            }
          />
        )}

        {currentScreen === 'caregiver' && (
          <CaregiverDashboard
            onNavigate={(dest, childId) => {
              if (childId) {
                setAppState((s) => ({ ...s, selectedChildId: childId }))
              }
              if (dest === 'games') navigate('games')
              else if (dest === 'family') navigate('family')
              else if (dest === 'student') navigate('student')
              else if (dest === 'child-profile') navigate('child-profile')
              else if (dest === 'wordsplash') navigate('wordsplash')
            }}
          />
        )}

        {currentScreen === 'student' && (
          <StudentDashboard
            onNavigate={(dest) => {
              if (dest === 'games') navigate('games')
              else if (dest === 'caregiver') navigate('caregiver')
              else if (dest === 'wordsplash') navigate('wordsplash')
            }}
          />
        )}

        {currentScreen === 'games' && (
          <GamesLibrary
            role={appState.userRole ?? 'caregiver'}
            onBack={() => navigate(homeScreen)}
            onPlayGame={handlePlayGame}
          />
        )}

        {currentScreen === 'wordsplash' && (
          <WordSplashGame onBackToApp={() => navigate('games')} />
        )}

        {currentScreen === 'family' && (
          <FamilyPage
            onBack={() => navigate('caregiver')}
            onSelectChild={(childId) => {
              setAppState((s) => ({ ...s, selectedChildId: childId }))
              navigate('child-profile')
            }}
          />
        )}

        {currentScreen === 'child-profile' && (
          <ChildProfile
            childId={appState.selectedChildId || 'samuel'}
            onBack={() => navigate('family')}
          />
        )}
      </>
    )
  }

  return (
    <div className={`app-wrapper ${isDesktop ? 'app-wrapper--desktop' : 'app-wrapper--phone'}`}>
      {showSidebar ? (
        <div className="app-wrapper--desktop">
          <DesktopSidebar
            activeScreen={currentScreen}
            userRole={appState.userRole}
            onNavigate={(dest) => navigate(dest as Screen)}
            onToggleRole={handleToggleRole}
          />
          <main className="desktop-main-content dashboard-main-content">
            <div className="desktop-content-body">
              <div className="desktop-content-inner">{renderActiveScreen()}</div>
            </div>
          </main>
        </div>
      ) : currentScreen === 'signup' || currentScreen === 'login' ? (
        renderActiveScreen()
      ) : isDesktop && !isGameActive ? (
        <div
          className="desktop-main-content"
          style={{
            width: '100vw',
            height: '100vh',
            background:
              currentScreen === 'landing'
                ? '#0B1628'
                : currentScreen === 'struggle'
                ? '#4A4FD4'
                : currentScreen === 'splash' || currentScreen === 'congratulations'
                ? '#2ECC71'
                : '#FFFFFF',
          }}
        >
          <div className="desktop-content-body">
            <div
              className="desktop-content-inner"
              style={{
                maxWidth: currentScreen === 'landing' ? 'none' : 960,
                margin: '0 auto',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {renderActiveScreen()}
            </div>
          </div>
        </div>
      ) : (
        <div className="phone-shell">
          {renderActiveScreen()}
          {!isAuthScreen && !isGameActive && (
            <BottomNav
              active={currentScreen === 'games' ? 'games' : currentScreen === 'family' || currentScreen === 'child-profile' ? 'family' : 'home'}
              onNavigate={(item) => navigate(item === 'home' ? homeScreen : item)}
            />
          )}
        </div>
      )}

      {/* Global Accessibility & Sensory Settings Drawer */}
      <AccessibilityModal />
    </div>
  )
}

export default function App() {
  return (
    <AccessibilityProvider>
      <MainApp />
    </AccessibilityProvider>
  )
}
