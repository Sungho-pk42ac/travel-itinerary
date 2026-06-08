import { allActivities, type Activity } from '../data/itinerary'

/** 평탄화된 활동 + 절대 시각. */
export interface TimedActivity extends Activity {
  day: number
  date: string
  /** 활동 시작 절대 시각(Asia/Tokyo 오프셋 고정) */
  when: Date
}

/** 여행 진행 상태. */
export type TripPhase = 'before' | 'during' | 'after'

export interface UpcomingResult {
  phase: TripPhase
  /** 현재 진행 중(가장 최근 지난 항목) — 여행 중일 때 */
  current: TimedActivity | null
  /** 다음 예정 항목 */
  next: TimedActivity | null
}

/** 활동에 절대 시각을 부여(Asia/Tokyo = +09:00). */
function withTimes(): TimedActivity[] {
  return allActivities().map((a) => ({
    ...a,
    when: new Date(`${a.date}T${a.time}:00+09:00`),
  }))
}

/**
 * 현재 시각 기준 "지금/다음" 일정 계산.
 * - 여행 전: phase=before, next=Day1 첫 항목
 * - 여행 중: phase=during, current=직전 항목, next=다음 항목
 * - 여행 후: phase=after, current=마지막 항목
 */
export function getUpcoming(now: Date = new Date()): UpcomingResult {
  const items = withTimes()
  if (items.length === 0) return { phase: 'before', current: null, next: null }

  const t = now.getTime()
  const first = items[0]
  const last = items[items.length - 1]

  if (t < first.when.getTime()) {
    return { phase: 'before', current: null, next: first }
  }
  if (t > last.when.getTime()) {
    return { phase: 'after', current: last, next: null }
  }

  // 여행 중: 마지막으로 지난 항목 = current, 첫 미래 항목 = next
  let current: TimedActivity | null = null
  let next: TimedActivity | null = null
  for (const item of items) {
    if (item.when.getTime() <= t) current = item
    else {
      next = item
      break
    }
  }
  return { phase: 'during', current, next }
}
