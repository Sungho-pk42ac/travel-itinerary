import { itinerary } from '../data/itinerary'
import { pois, type Poi } from '../data/poi'

/** poiId → 해당 POI가 등장하는 일자 번호들. */
export function poiDayMap(): Record<string, number[]> {
  const map: Record<string, number[]> = {}
  for (const day of itinerary) {
    for (const a of day.activities) {
      if (!a.poiId) continue
      ;(map[a.poiId] ??= []).push(day.day)
    }
  }
  // 중복 제거
  for (const k of Object.keys(map)) map[k] = [...new Set(map[k])]
  return map
}

/** day(null=전체)에 보여줄 POI 목록. */
export function poisForDay(day: number | null): Poi[] {
  if (day == null) return pois
  const dm = poiDayMap()
  return pois.filter((p) => dm[p.id]?.includes(day))
}
