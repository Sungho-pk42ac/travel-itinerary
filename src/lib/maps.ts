/** 위경도 좌표. */
export interface LatLng {
  lat: number
  lng: number
}

/** 구글맵 길찾기(대중교통) 새 탭 링크 — 무키 폴백에서도 동작. */
export function googleDirectionsUrl(dest: LatLng): string {
  return `https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=${dest.lat},${dest.lng}`
}

/** 구글맵 장소 검색 링크. */
export function googleSearchUrl(query: string, coords?: LatLng): string {
  const base = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  return coords ? `${base}&query=${coords.lat},${coords.lng}` : base
}
