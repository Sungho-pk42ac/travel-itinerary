import AppShell from './components/AppShell'
import AppRoutes from './router'
import Onboarding from './features/onboarding/Onboarding'
import Copilot from './features/copilot/Copilot'

/** 앱 루트 — 온보딩 스플래시 + 셸 + 라우트 + AI 코파일럿. */
export default function App() {
  return (
    <>
      <Onboarding />
      <AppShell>
        <AppRoutes />
      </AppShell>
      <Copilot />
    </>
  )
}
