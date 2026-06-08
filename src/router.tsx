import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './features/home/HomePage'
import OverviewPage from './features/overview/OverviewPage'
import DayPage from './features/day/DayPage'
import MapPage from './features/map/MapPage'
import InfoPage from './features/info/InfoPage'

/** 앱 라우트 — Home·Overview·Day:n·Map·Info. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/day/:n" element={<DayPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/info" element={<InfoPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
