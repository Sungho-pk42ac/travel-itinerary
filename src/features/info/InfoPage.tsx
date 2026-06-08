import { useFx, useWeather } from '../home/queries'

/** API 연결 상태 배지. */
function StatusBadge({ isLoading, isError }: { isLoading: boolean; isError: boolean }) {
  if (isLoading)
    return <span className="rounded-pill bg-cream px-2 py-0.5 text-xs text-muted">확인 중…</span>
  if (isError)
    return <span className="rounded-pill bg-coral-soft px-2 py-0.5 text-xs text-danger">실패(폴백)</span>
  return <span className="rounded-pill bg-rosegold-soft/60 px-2 py-0.5 text-xs text-ok">정상</span>
}

/** 정보 — API 상태 모니터 · 비상 연락처 · 개인정보 정책. */
export default function InfoPage() {
  const weather = useWeather()
  const fx = useFx()

  return (
    <div className="space-y-4">
      {/* API 상태 */}
      <section className="rounded-card bg-surface p-4 shadow-soft">
        <h1 className="font-display text-xl font-bold text-ink">API 상태</h1>
        <p className="mt-0.5 text-sm text-muted">실패해도 앱은 폴백으로 계속 동작합니다.</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-charcoal">날씨 (Open-Meteo)</span>
            <StatusBadge isLoading={weather.isLoading} isError={weather.isError} />
          </li>
          <li className="flex items-center justify-between">
            <span className="text-charcoal">환율 (open.er-api)</span>
            <StatusBadge isLoading={fx.isLoading} isError={fx.isError} />
          </li>
        </ul>
      </section>

      {/* 비상 연락처 */}
      <section className="rounded-card bg-surface p-4 shadow-soft">
        <h2 className="font-display text-lg font-bold text-ink">🆘 비상 연락처</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <Contact label="경찰 (일본)" tel="110" />
          <Contact label="소방·구급 (일본)" tel="119" />
          <Contact label="외교부 영사콜센터 (24h)" tel="+82-2-3210-0404" />
        </ul>
        <p className="mt-2 text-[11px] text-muted">
          현지 카드 분실 시 카드 뒷면 분실신고 번호로 연락. 번호는 출국 전 재확인 권장.
        </p>
      </section>

      {/* 개인정보 정책 */}
      <section className="rounded-card bg-surface p-4 shadow-soft">
        <h2 className="font-display text-lg font-bold text-ink">🔒 개인정보</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-charcoal">
          <li>e-티켓·여권·예약번호 등 민감정보는 앱에 저장/표시하지 않습니다.</li>
          <li>날씨·환율은 무료·무키 공개 API를 브라우저에서 직접 호출합니다.</li>
          <li>환산기 입력값만 기기 localStorage에 저장(서버 전송 없음).</li>
        </ul>
      </section>
    </div>
  )
}

function Contact({ label, tel }: { label: string; tel: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-charcoal">{label}</span>
      <a href={`tel:${tel}`} className="font-medium text-coral tabular-nums">
        {tel}
      </a>
    </li>
  )
}
