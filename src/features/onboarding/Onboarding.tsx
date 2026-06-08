import { useEffect, useState } from 'react'
import { useAppStore } from '../../app/store'
import { getDDay, trip } from '../../data/trip'

const SPLASH_MS = 1500

/**
 * 온보딩 스플래시 — 매 페이지 로드 시 약 1.5초 커플 환영 후 자동 진입.
 * 탭/클릭 즉시 스킵, prefers-reduced-motion 시 표시 없이 즉시 스킵.
 * 세션 플래그(splashDone)로 SPA 라우트 전환 시 재노출하지 않음.
 */
export default function Onboarding() {
  const splashDone = useAppStore((s) => s.splashDone)
  const markSplashDone = useAppStore((s) => s.markSplashDone)
  const [leaving, setLeaving] = useState(false)

  // 이미 끝났거나 모션 최소화 선호면 렌더하지 않음
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true

  useEffect(() => {
    if (splashDone || reduceMotion) {
      markSplashDone()
      return
    }
    const fade = window.setTimeout(() => setLeaving(true), SPLASH_MS - 350)
    const done = window.setTimeout(() => markSplashDone(), SPLASH_MS)
    return () => {
      window.clearTimeout(fade)
      window.clearTimeout(done)
    }
  }, [splashDone, reduceMotion, markSplashDone])

  if (splashDone || reduceMotion) return null

  const dday = getDDay()
  const ddayLabel = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-DAY' : `여행 ${-dday}일차`

  return (
    <div
      role="presentation"
      onClick={markSplashDone}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rosegold to-coral text-white transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex -space-x-4">
        <img
          src="/img/couple-sungho.jpg"
          alt=""
          className="h-20 w-20 rounded-full border-4 border-white/80 object-cover shadow-float"
        />
        <img
          src="/img/couple-seeun.jpg"
          alt=""
          className="h-20 w-20 rounded-full border-4 border-white/80 object-cover shadow-float"
        />
      </div>
      <p className="mt-5 font-display text-2xl font-bold tracking-tight">
        {trip.partnerA} <span className="text-white/90">♥</span> {trip.partnerB}
      </p>
      <p className="mt-1 text-sm text-white/85">
        {trip.destination} · {ddayLabel}
      </p>
      <p className="mt-6 text-xs text-white/70">탭하면 바로 시작</p>
    </div>
  )
}
