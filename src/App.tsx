import { useState } from 'react'
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext'
import AccessibilityModal from './components/AccessibilityModal'
import DesktopSidebar from './components/DesktopSidebar'
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

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing')
  const [appState, setAppState] = useState<AppState>({
    selectedStruggle: null,
    userRole: null,
    selectedChildId: null,
  })

  const { activeLayout } = useAccessibility()

  const navigate = (screen: Screen) => setCurrentScreen(screen)

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
            onLogin={() => navigate('signup')}
          />
        )}

        {currentScreen === 'splash' && (
          <SplashScreen onNext={() => navigate('signup')} />
        )}

        {currentScreen === 'signup' && (
          <SignUpScreen
            onContinue={(role: UserRole) => {
              setAppState((s) => ({ ...s, userRole: role }))
              navigate('struggle')
            }}
          />
        )}

        {currentScreen === 'struggle' && (
          <StruggleScreen
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
            onNavigate={(dest) => {
              if (dest === 'games') navigate('games')
              else if (dest === 'family') navigate('family')
              else if (dest === 'student') navigate('student')
            }}
          />
        )}

        {currentScreen === 'student' && (
          <StudentDashboard
            onNavigate={(dest) => {
              if (dest === 'games') navigate('games')
              else if (dest === 'caregiver') navigate('caregiver')
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
          <main className="desktop-main-content">
            <div className="desktop-content-body">
              <div className="desktop-content-inner">{renderActiveScreen()}</div>
            </div>
          </main>
        </div>
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
                maxWidth: currentScreen === 'landing' ? 1200 : 960,
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
        <div className="phone-shell">{renderActiveScreen()}</div>
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
