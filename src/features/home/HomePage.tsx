import { Link } from 'react-router-dom'
import MetricCard from '../../components/MetricCard'
import { getDDay, trip } from '../../data/trip'
import { getUpcoming } from '../../lib/nextEvent'
import { describeWeather, type CityWeather } from '../../lib/openMeteo'
import { jpyToKrw } from '../../lib/fx'
import { dayTotals, formatKRW, grandTotal } from '../../lib/budget'
import { useAppStore } from '../../app/store'
import { useFx, useWeather } from './queries'

/** 홈(커맨드 센터) — D-day·다음일정·날씨·환율·예산. */
export default function HomePage() {
  const dday = getDDay()
  const ddayLabel = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-DAY' : `여행 ${-dday}일차`

  return (
    <div className="space-y-4">
      {/* D-day 히어로 */}
      <section className="rounded-card bg-gradient-to-br from-rosegold to-coral p-6 text-white shadow-float">
        <p className="text-sm opacity-90">
          {trip.destination} · {trip.startDate} ~ {trip.endDate}
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">{ddayLabel}</p>
        <p className="mt-1 text-sm opacity-90">
          {trip.partnerA} ♥ {trip.partnerB}
        </p>
      </section>

      <NextEventCard />
      <WeatherCard />
      <FxCard />
      <BudgetCard />
    </div>
  )
}

/** 현재 시각 기준 "지금/다음" 일정. */
function NextEventCard() {
  const { phase, current, next } = getUpcoming()

  return (
    <section className="rounded-card bg-surface p-4 shadow-soft">
      <h2 className="text-sm font-semibold text-muted">📍 지금 / 다음 일정</h2>
      {phase === 'after' ? (
        <p className="mt-2 text-base text-charcoal">여행이 끝났어요. 다음 여행도 함께 🩷</p>
      ) : (
        <div className="mt-2 space-y-2">
          {current && (
            <Row badge="지금" tone="coral" day={current.day} time={current.time} title={current.title} />
          )}
          {next ? (
            <Row badge="다음" tone="rose" day={next.day} time={next.time} title={next.title} poiId={next.poiId} />
          ) : (
            <p className="text-sm text-muted">예정된 다음 일정이 없어요.</p>
          )}
        </div>
      )}
    </section>
  )
}

function Row({
  badge,
  tone,
  day,
  time,
  title,
  poiId,
}: {
  badge: string
  tone: 'coral' | 'rose'
  day: number
  time: string
  title: string
  poiId?: string
}) {
  const toneCls = tone === 'coral' ? 'bg-coral text-white' : 'bg-rosegold-soft/70 text-rosegold'
  return (
    <div className="flex items-center gap-2">
      <span className={`shrink-0 rounded-pill px-2 py-0.5 text-[11px] font-medium ${toneCls}`}>
        {badge}
      </span>
      <Link to={`/day/${day}`} className="min-w-0 flex-1">
        <span className="text-xs text-muted tabular-nums">D{day} {time}</span>
        <p className="truncate text-sm font-medium text-charcoal">{title}</p>
      </Link>
      {poiId && (
        <Link to="/map" className="shrink-0 text-xs font-medium text-coral">
          지도 →
        </Link>
      )}
    </div>
  )
}

/** 오사카·교토 날씨. */
function WeatherCard() {
  const { data, isLoading, isError } = useWeather()
  return (
    <MetricCard title="현지 날씨" icon="🌤️" isLoading={isLoading} isError={isError} errorText="날씨 불러오기 실패">
      {data && (
        <div className="grid grid-cols-2 gap-3">
          <CityWeatherBlock w={data.osaka} />
          <CityWeatherBlock w={data.kyoto} />
        </div>
      )}
    </MetricCard>
  )
}

function CityWeatherBlock({ w }: { w: CityWeather }) {
  const today = w.daily[0]
  const cur = w.current
  const desc = describeWeather(cur?.code ?? today?.code ?? 0)
  return (
    <div className="rounded-lg bg-cream/60 p-3">
      <p className="text-xs font-medium text-muted">{w.city}</p>
      <p className="mt-0.5 font-display text-2xl font-bold text-ink">
        {desc.icon} {cur ? `${cur.temp}°` : today ? `${today.tMax}°` : '—'}
      </p>
      {today && (
        <p className="mt-0.5 text-xs text-muted">
          {today.tMin}° / {today.tMax}° · 강수 {today.precipProb}%
        </p>
      )}
    </div>
  )
}

/** 환율 + 엔→원 환산기. */
function FxCard() {
  const { data, isLoading, isError } = useFx()
  const jpyInput = useAppStore((s) => s.jpyInput)
  const setJpyInput = useAppStore((s) => s.setJpyInput)

  return (
    <MetricCard title="환율 (엔 → 원)" icon="💴" isLoading={isLoading} isError={isError} errorText="환율 불러오기 실패">
      {data && (
        <div className="space-y-3">
          <p className="text-sm text-charcoal">
            100엔 ≈ <span className="font-semibold">{formatKRW(jpyToKrw(100, data))}</span>
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={jpyInput}
              onChange={(e) => setJpyInput(Number(e.target.value))}
              aria-label="엔 입력"
              className="w-28 rounded-lg border border-line bg-ivory px-3 py-2 text-sm tabular-nums focus:border-coral focus:outline-none"
            />
            <span className="text-sm text-muted">엔 =</span>
            <span className="font-display text-lg font-bold text-coral tabular-nums">
              {formatKRW(jpyToKrw(jpyInput, data))}
            </span>
          </div>
        </div>
      )}
    </MetricCard>
  )
}

/** 일자별 예상 지출 막대 + 총합(2인). */
function BudgetCard() {
  const days = dayTotals()
  const total = grandTotal()
  const max = Math.max(...days.map((d) => d.total), 1)

  return (
    <MetricCard title="예상 경비 (2인)" icon="🧮">
      <p className="font-display text-2xl font-bold text-ink">{formatKRW(total)}</p>
      <div className="mt-3 space-y-2">
        {days.map((d) => (
          <div key={d.day} className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-xs text-muted">{d.label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-pill bg-cream">
              <div
                className="h-full rounded-pill bg-gradient-to-r from-rosegold to-coral"
                style={{ width: `${(d.total / max) * 100}%` }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-xs tabular-nums text-charcoal">
              {formatKRW(d.total)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted">숙박·입장·이동·식사 추정 합계(쇼핑 별도)</p>
    </MetricCard>
  )
}
