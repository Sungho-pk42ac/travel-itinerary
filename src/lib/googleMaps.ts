/** Google Maps 키 유무. 있으면 Google Map, 없으면 Leaflet+OSM 폴백. */
export function isGoogleMapsEnabled(): boolean {
  return Boolean(import.meta.env.VITE_GOOGLE_MAPS_KEY)
}

/** 프론트 노출용 Maps 키(리퍼러 제한이 실질 보호). */
export function googleMapsKey(): string {
  return import.meta.env.VITE_GOOGLE_MAPS_KEY ?? ''
}
