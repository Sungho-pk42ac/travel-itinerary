/**
 * 여행 고정 메타데이터 — 박성호 ♥ 양세은 오사카 여행.
 * 단일 소스(single source of truth)로 D-day·온보딩·헤더가 공유한다.
 */
export const trip = {
  partnerA: '박성호',
  partnerB: '양세은',
  destination: '오사카',
  /** 여행 시작/종료 (Asia/Tokyo 기준 날짜) */
  startDate: '2026-06-26',
  endDate: '2026-06-29',
  /** 총 일수 */
  totalDays: 4,
} as const

/** 'YYYY-MM-DD' 문자열을 자정 기준 일수(epoch days)로 변환. */
function toEpochDays(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number)
  return Date.UTC(y, m - 1, d) / 86_400_000
}

/**
 * D-day 계산: Asia/Tokyo 기준 오늘 날짜에서 출발일까지 남은 일수.
 * 음수면 여행 중/후. (현지 달력일 기준이라 UTC 자정 오프셋 버그 없음)
 */
export function getDDay(now: Date = new Date()): number {
  const tokyoToday = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now) // 'YYYY-MM-DD'
  return toEpochDays(trip.startDate) - toEpochDays(tokyoToday)
}
