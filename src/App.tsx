import AppShell from './components/AppShell'
import AppRoutes from './router'
import Onboarding from './features/onboarding/Onboarding'

/** 앱 루트 — 온보딩 스플래시 + 셸 안에 라우트. */
export default function App() {
  return (
    <>
      <Onboarding />
      <AppShell>
        <AppRoutes />
      </AppShell>
    </>
  )
}
