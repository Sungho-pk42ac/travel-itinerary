import AppShell from './components/AppShell'
import AppRoutes from './router'

/** 앱 루트 — 셸 안에 라우트를 렌더. */
export default function App() {
  return (
    <AppShell>
      <AppRoutes />
    </AppShell>
  )
}
