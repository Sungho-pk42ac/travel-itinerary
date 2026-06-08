import PagePlaceholder from '../../components/PagePlaceholder'
import { getDDay, trip } from '../../data/trip'

/** 홈(커맨드 센터) — 스켈레톤 단계에서는 D-day만 실제 표시. */
export default function HomePage() {
  const dday = getDDay()
  const ddayLabel = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-DAY' : `여행 ${-dday}일차`

  return (
    <PagePlaceholder title="홈" subtitle="우리 여행의 커맨드 센터">
      <div className="rounded-card bg-gradient-to-br from-rosegold to-coral p-6 text-white shadow-float">
        <p className="text-sm/relaxed opacity-90">
          {trip.destination} · {trip.startDate} ~ {trip.endDate}
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">{ddayLabel}</p>
        <p className="mt-1 text-sm opacity-90">
          {trip.partnerA} ♥ {trip.partnerB}
        </p>
      </div>
      <p className="text-sm text-muted">
        다음 슬라이스에서 날씨·환율·다음 일정 위젯이 여기에 추가됩니다.
      </p>
    </PagePlaceholder>
  )
}
