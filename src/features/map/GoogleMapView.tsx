import { useState } from 'react'
import { APIProvider, InfoWindow, Map, Marker } from '@vis.gl/react-google-maps'
import type { Poi } from '../../data/poi'
import { googleDirectionsUrl } from '../../lib/maps'
import { googleMapsKey } from '../../lib/googleMaps'

/**
 * 키 있을 때의 Google Map(progressive enhancement).
 * 마커 + InfoWindow(이름·길찾기). 키는 리퍼러 제한이 실질 보호.
 * (Places Details 사진·평점 보강은 POI place_id 확보 후 후속.)
 */
export default function GoogleMapView({ pois }: { pois: Poi[] }) {
  const [selected, setSelected] = useState<Poi | null>(null)

  return (
    <APIProvider apiKey={googleMapsKey()}>
      <Map
        defaultCenter={{ lat: 34.6815, lng: 135.5092 }}
        defaultZoom={11}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ height: '60vh', width: '100%' }}
      >
        {pois.map((p) => (
          <Marker
            key={p.id}
            position={{ lat: p.coords.lat, lng: p.coords.lng }}
            title={p.name}
            onClick={() => setSelected(p)}
          />
        ))}
        {selected && (
          <InfoWindow
            position={{ lat: selected.coords.lat, lng: selected.coords.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div style={{ minWidth: 140 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{selected.name}</p>
              <a
                href={googleDirectionsUrl(selected.coords)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FF6F61', fontSize: 13, fontWeight: 600 }}
              >
                구글맵 길찾기 →
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  )
}
