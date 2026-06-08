import { itinerary } from '../data/itinerary'

/** '₩320,000(입장+익스프레스)' → 320000. 매칭 없으면 0. */
export function parseKRW(cost?: string): number {
  if (!cost) return 0
  const m = cost.match(/₩\s*([\d,]+)/)
  if (!m) return 0
  return Number(m[1].replace(/,/g, '')) || 0
}

/** 일자별 예상 지출 합계(2인). */
export function dayTotals(): Array<{ day: number; label: string; total: number }> {
  return itinerary.map((d) => ({
    day: d.day,
    label: `Day ${d.day}`,
    total: d.activities.reduce((sum, a) => sum + parseKRW(a.cost), 0),
  }))
}

/** 전체 예상 지출 합계(2인). */
export function grandTotal(): number {
  return dayTotals().reduce((s, d) => s + d.total, 0)
}

/** ₩ 천단위 콤마 포맷. */
export function formatKRW(n: number): string {
  return `₩${n.toLocaleString('ko-KR')}`
}
