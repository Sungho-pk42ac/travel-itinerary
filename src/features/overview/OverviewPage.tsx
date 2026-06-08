import { Link } from 'react-router-dom'
import { flights, policies } from '../../data/flights'
import { trip } from '../../data/trip'

/** 개요 — 우리 이야기 + 항공 요약 + 여행 정책. */
export default function OverviewPage() {
  return (
    <div className="space-y-4">
      {/* 우리 이야기 */}
      <section className="rounded-card bg-surface p-5 shadow-soft">
        <h1 className="font-display text-xl font-bold text-ink">우리 이야기</h1>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex -space-x-3">
            <img
              src="/img/couple-sungho.jpg"
              alt={trip.partnerA}
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-soft"
            />
            <img
              src="/img/couple-seeun.jpg"
              alt={trip.partnerB}
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-soft"
            />
          </div>
          <div>
            <p className="font-display font-semibold text-charcoal">
              {trip.partnerA} <span className="text-coral">♥</span> {trip.partnerB}
            </p>
            <p className="text-sm text-muted">
              {trip.destination} · {trip.startDate} ~ {trip.endDate} · 첫 해외 커플 여행
            </p>
          </div>
        </div>
      </section>

      {/* 우리 추억 진입 */}
      <Link
        to="/memory"
        className="flex items-center justify-between rounded-card bg-gradient-to-br from-rosegold to-coral p-4 text-white shadow-soft"
      >
        <span>
          <span className="font-display font-semibold">💌 우리 추억 · 버킷리스트</span>
          <span className="mt-0.5 block text-xs text-white/85">두 폰 실시간 공유 메모리</span>
        </span>
        <span aria-hidden>→</span>
      </Link>

      {/* 항공 요약 */}
      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted">✈️ 항공편</h2>
        {flights.map((f) => (
          <div key={f.flightNo} className="rounded-card bg-surface p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="rounded-pill bg-rosegold-soft/60 px-2 py-0.5 text-xs font-medium text-rosegold">
                {f.label}
              </span>
              <span className="text-xs text-muted">{f.date}</span>
            </div>
            <p className="mt-2 font-display text-lg font-bold text-ink">{f.route}</p>
            <p className="text-sm text-charcoal">
              {f.airline} {f.flightNo} · {f.timeNote}
            </p>
            <a
              href={f.airlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-coral"
            >
              항공사 예약확인 →
            </a>
          </div>
        ))}
        <p className="px-1 text-[11px] text-muted">
          e-티켓/예약번호는 보안을 위해 앱에 포함하지 않습니다.
        </p>
      </section>

      {/* 정책/체크 */}
      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted">📋 여행 정책 · 체크</h2>
        {policies.map((p) => (
          <div key={p.title} className="flex gap-3 rounded-card bg-surface p-4 shadow-soft">
            <span className="text-xl" aria-hidden>
              {p.icon}
            </span>
            <div>
              <p className="font-medium text-charcoal">{p.title}</p>
              <p className="text-sm text-muted">{p.detail}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
