import { useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { poisForDay } from '../../lib/poiDays'
import { googleDirectionsUrl } from '../../lib/maps'
import { trip } from '../../data/trip'

/** 카테고리 → 핀 이모지. */
const catIcon: Record<string, string> = {
  attraction: '📸',
  food: '🍴',
  shopping: '🛍️',
  activity: '🎈',
  transport: '✈️',
}

/** 코랄 커스텀 핀(Leaflet 기본 아이콘 깨짐 회피). */
function pinIcon(emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div style="font-size:20px;line-height:34px;width:34px;height:34px;text-align:center;background:#fff;border:2px solid #FF6F61;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 10px -3px rgba(43,43,51,.4)"><span style="display:inline-block;transform:rotate(45deg)">${emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  })
}

const FILTERS: Array<{ label: string; day: number | null }> = [
  { label: '전체', day: null },
  ...Array.from({ length: trip.totalDays }, (_, i) => ({ label: `D${i + 1}`, day: i + 1 })),
]

/** 지도 — React Leaflet + OSM 타일, 일자 필터, POI 마커·구글맵 길찾기. */
export default function MapPage() {
  const [day, setDay] = useState<number | null>(null)
  const visible = useMemo(() => poisForDay(day), [day])

  // 오사카 도심 중심(필터에 따라 마커가 바뀌어도 기본 뷰 유지)
  const center: [number, number] = [34.6815, 135.5092]

  return (
    <section className="space-y-3">
      <div className="rounded-card bg-surface p-4 shadow-soft">
        <h1 className="font-display text-2xl font-bold text-ink">지도</h1>
        <p className="mt-0.5 text-sm text-muted">장소와 동선 · 핀을 탭하면 길찾기</p>
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
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: '60vh', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visible.map((p) => (
            <Marker
              key={p.id}
              position={[p.coords.lat, p.coords.lng]}
              icon={pinIcon(catIcon[p.category] ?? '📍')}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold text-charcoal">{p.name}</p>
                  <a
                    href={googleDirectionsUrl(p.coords)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-coral"
                  >
                    구글맵 길찾기 →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <p className="px-1 text-[11px] text-muted">
        지도 데이터 © OpenStreetMap 기여자 · {visible.length}개 장소 표시
      </p>
    </section>
  )
}
