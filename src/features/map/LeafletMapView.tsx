import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Poi } from '../../data/poi'
import { googleDirectionsUrl } from '../../lib/maps'

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

/** 무키 폴백 지도 — React Leaflet + OSM 타일. */
export default function LeafletMapView({ pois }: { pois: Poi[] }) {
  const center: [number, number] = [34.6815, 135.5092]
  return (
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
      {pois.map((p) => (
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
  )
}
