import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './features/home/HomePage'
import OverviewPage from './features/overview/OverviewPage'
import DayPage from './features/day/DayPage'
import InfoPage from './features/info/InfoPage'

// 지도(Leaflet 번들)는 /map 진입 시에만 로드 — 초기 번들 경량화.
const MapPage = lazy(() => import('./features/map/MapPage'))

/** 라우트 로딩 폴백. */
function RouteFallback() {
  return (
    <div className="flex justify-center py-16 text-sm text-muted" role="status">
      불러오는 중…
    </div>
  )
}

/** 앱 라우트 — Home·Overview·Day:n·Map·Info. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/day/:n" element={<DayPage />} />
      <Route
        path="/map"
        element={
          <Suspense fallback={<RouteFallback />}>
            <MapPage />
          </Suspense>
        }
      />
      <Route path="/info" element={<InfoPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
