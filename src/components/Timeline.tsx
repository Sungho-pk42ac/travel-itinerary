import type { ReactNode } from 'react'
import type { Activity } from '../data/itinerary'

/** 우천 민감도 → 칩 라벨/색. */
const rainChip: Record<NonNullable<Activity['rain']>, { label: string; cls: string }> = {
  outdoor: { label: '야외', cls: 'bg-coral-soft text-coral' },
  indoor: { label: '실내', cls: 'bg-rosegold-soft/60 text-rosegold' },
  mixed: { label: '혼합', cls: 'bg-cream text-muted' },
}

/**
 * 시간대별 수직 타임라인.
 * 좌측 시각 + 코랄 커넥터 + 카드(제목·이유·이동·비용·우천 칩).
 * onSelect가 있으면 POI 연결 항목을 클릭 가능하게(바텀시트는 후속 슬라이스).
 */
export default function Timeline({
  activities,
  onSelect,
}: {
  activities: Activity[]
  onSelect?: (poiId: string) => void
}) {
  return (
    <ol className="relative space-y-3">
      {activities.map((a, i) => {
        const clickable = Boolean(a.poiId && onSelect)
        return (
          <li key={`${a.time}-${i}`} className="flex gap-3">
            <div className="flex w-14 shrink-0 flex-col items-end pt-1">
              <span className="font-display text-sm font-bold text-charcoal tabular-nums">
                {a.time}
              </span>
            </div>
            <div className="relative flex flex-col items-center">
              <span
                className={`mt-2 h-3 w-3 rounded-full ${a.highlight ? 'bg-coral' : 'bg-rosegold-soft'}`}
                aria-hidden
              />
              {i < activities.length - 1 && <span className="w-px flex-1 bg-line" aria-hidden />}
            </div>
            <ActivityCard a={a} clickable={clickable} onSelect={onSelect} />
          </li>
        )
      })}
    </ol>
  )
}

function ActivityCard({
  a,
  clickable,
  onSelect,
}: {
  a: Activity
  clickable: boolean
  onSelect?: (poiId: string) => void
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-ink">
          {a.highlight && <span className="mr-1 text-coral">★</span>}
          {a.title}
        </h3>
        {a.rain && (
          <span className={`shrink-0 rounded-pill px-2 py-0.5 text-[11px] ${rainChip[a.rain].cls}`}>
            {rainChip[a.rain].label}
          </span>
        )}
      </div>
      {a.reason && <p className="mt-0.5 text-sm text-muted">{a.reason}</p>}
      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-muted">
        {a.transport && <Chip>{a.transport}</Chip>}
        {a.cost && <Chip>{a.cost}</Chip>}
        {a.meal && <Chip>🍴 {a.meal}</Chip>}
      </div>
      {a.note && <p className="mt-2 text-xs text-rosegold">{a.note}</p>}
    </>
  )

  const base = 'mb-1 flex-1 rounded-card bg-surface p-4 text-left shadow-soft'
  if (clickable && a.poiId) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(a.poiId!)}
        className={`${base} transition-transform active:scale-[0.99] hover:shadow-float`}
      >
        {body}
        <span className="mt-2 inline-block text-xs font-medium text-coral">장소 정보 →</span>
      </button>
    )
  }
  return <div className={base}>{body}</div>
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded-pill bg-cream px-2 py-0.5">{children}</span>
}
