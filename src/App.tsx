import { useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import SignUpScreen from './screens/SignUpScreen'
import StruggleScreen from './screens/StruggleScreen'
import CongratulationsScreen from './screens/CongratulationsScreen'
import CaregiverDashboard from './screens/CaregiverDashboard'
import StudentDashboard from './screens/StudentDashboard'

export type Screen =
  | 'splash'
  | 'signup'
  | 'struggle'
  | 'congratulations'
  | 'caregiver'
  | 'student'

export type UserRole = 'caregiver' | 'student' | null

export interface AppState {
  selectedStruggle: string | null
  userRole: UserRole
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash')
  const [appState, setAppState] = useState<AppState>({
    selectedStruggle: null,
    userRole: null,
  })

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const screens: Record<Screen, React.ReactNode> = {
    splash: <SplashScreen onNext={() => navigate('signup')} />,
    signup: (
      <SignUpScreen
        onContinue={(role: UserRole) => {
          setAppState((s) => ({ ...s, userRole: role }))
          navigate('struggle')
        }}
      />
    ),
    struggle: (
      <StruggleScreen
        onSelect={(struggle: string) => {
          setAppState((s) => ({ ...s, selectedStruggle: struggle }))
          navigate('congratulations')
        }}
      />
    ),
    congratulations: (
      <CongratulationsScreen
        onContinue={() => {
          navigate(appState.userRole === 'student' ? 'student' : 'caregiver')
        }}
      />
    ),
    caregiver: (
      <CaregiverDashboard onSwitchToStudent={() => navigate('student')} />
    ),
    student: (
      <StudentDashboard onSwitchToCaregiver={() => navigate('caregiver')} />
    ),
  }

  return (
    <div className="phone-shell">
      {screens[currentScreen]}
    </div>
  )
}
