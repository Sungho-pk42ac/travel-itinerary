import { lazy, Suspense, useMemo, useState } from 'react'
import { poisForDay } from '../../lib/poiDays'
import { isGoogleMapsEnabled } from '../../lib/googleMaps'
import { trip } from '../../data/trip'

// 키 유무에 따라 필요한 지도 라이브러리만 로드(번들 분리).
const GoogleMapView = lazy(() => import('./GoogleMapView'))
const LeafletMapView = lazy(() => import('./LeafletMapView'))

const FILTERS: Array<{ label: string; day: number | null }> = [
  { label: '전체', day: null },
  ...Array.from({ length: trip.totalDays }, (_, i) => ({ label: `D${i + 1}`, day: i + 1 })),
]

/** 지도 — 헤더 + 일자 필터 + (Google 키 있으면 Google, 없으면 Leaflet). */
export default function MapPage() {
  const [day, setDay] = useState<number | null>(null)
  const visible = useMemo(() => poisForDay(day), [day])
  const useGoogle = isGoogleMapsEnabled()

  return (
    <section className="space-y-3">
      <div className="rounded-card bg-surface p-4 shadow-soft">
        <h1 className="font-display text-2xl font-bold text-ink">지도</h1>
        <p className="mt-0.5 text-sm text-muted">
          장소와 동선 · 핀을 탭하면 길찾기{useGoogle ? ' · Google' : ''}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="일자 필터">
          {FILTERS.map((f) => {
            const active = f.day === day
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setDay(f.day)}
                aria-pressed={active}
                className={`rounded-pill px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'bg-coral text-white' : 'bg-cream text-muted hover:text-charcoal'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-card shadow-soft">
        <Suspense
          fallback={
            <div className="flex h-[60vh] items-center justify-center text-sm text-muted">
              지도 불러오는 중…
            </div>
          }
        >
          {useGoogle ? <GoogleMapView pois={visible} /> : <LeafletMapView pois={visible} />}
        </Suspense>
      </div>
      <p className="px-1 text-[11px] text-muted">
        {useGoogle ? 'Google Maps' : '지도 데이터 © OpenStreetMap 기여자'} · {visible.length}개 장소 표시
      </p>
    </section>
  )
}
