import { useState } from 'react'
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

export type UserRole = 'caregiver' | 'student' | null

export interface AppState {
  selectedStruggle: string | null
  userRole: UserRole
  selectedChildId: string | null
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing')
  const [appState, setAppState] = useState<AppState>({
    selectedStruggle: null,
    userRole: null,
    selectedChildId: null,
  })

  const navigate = (screen: Screen) => setCurrentScreen(screen)

  const homeScreen = appState.userRole === 'student' ? 'student' : 'caregiver'

  return (
    <div className="phone-shell">
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
          onContinue={() => navigate(appState.userRole === 'student' ? 'student' : 'caregiver')}
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
        />
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

      {currentScreen === 'child-profile' && appState.selectedChildId && (
        <ChildProfile
          childId={appState.selectedChildId}
          onBack={() => navigate('family')}
        />
      )}
    </div>
  )
}
