import { useEffect, useState } from 'react'
import Persona from '../copilot/Persona'
import { getPoi } from '../../data/poi'
import { wikimediaPhoto } from '../../lib/wikimedia'
import { googleDirectionsUrl, googleSearchUrl, naverBlogSearchUrl } from '../../lib/maps'

type View = 'choose' | 'explain'

/**
 * 일정(POI) 탭 시 뜨는 풀스크린 강아지 가이드.
 * choose: 강아지가 "어떤 거 보고 싶어?" → 블로그 / 예약 / 설명
 * explain: 안경 쓴 강아지가 큐레이션 팩트로 설명(+ 사진·예약·블로그·더 물어보기)
 */
export default function PoiDog({ poiId, onClose }: { poiId: string | null; onClose: () => void }) {
  const poi = poiId ? getPoi(poiId) : undefined
  const [view, setView] = useState<View>('choose')
  const [imgFailed, setImgFailed] = useState(false)

  // 열릴 때마다 초기화 + Esc 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!poi) return
    setView('choose')
    setImgFailed(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [poi, onClose])

  if (!poi) return null

  const openBlog = () => window.open(naverBlogSearchUrl(poi.name), '_blank', 'noopener')
  const openBooking = () =>
    window.open(poi.bookingUrl ?? googleSearchUrl(poi.name, poi.coords), '_blank', 'noopener')
  const askDog = () => {
    window.dispatchEvent(new CustomEvent('osaka:ask', { detail: { q: `${poi.name} 더 알려줘!` } }))
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${poi.name} 가이드`}
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-cream to-ivory"
    >
      {/* 상단 닫기 */}
      <div className="flex justify-end p-4" style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-lg text-muted shadow-soft"
        >
          ✕
        </button>
      </div>

      {view === 'choose' ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
          <div className="animate-[bubblepop_0.3s_ease]">
            <Persona size={150} glasses={false} />
          </div>
          <div className="mt-5 rounded-2xl rounded-bl-sm bg-surface px-5 py-3 shadow-float ring-1 ring-line">
            <p className="font-display text-lg font-bold text-ink">
              멍! <span className="text-coral">{poi.name}</span> 뭐가 궁금해?
            </p>
          </div>
          <div className="mt-7 grid w-full max-w-xs gap-3">
            <ChoiceButton emoji="📝" label="블로그 후기" hint="네이버 블로그" onClick={openBlog} />
            <ChoiceButton emoji="🎟️" label="예약·정보" hint={poi.bookingLabel ?? '바로가기'} onClick={openBooking} />
            <ChoiceButton emoji="💬" label="설명 들을래" hint="강아지가 알려줄게" onClick={() => setView('explain')} primary />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pb-16">
          <div className="mx-auto max-w-md">
            <div className="flex flex-col items-center text-center">
              <Persona size={96} glasses />
              <p className="mt-2 text-xs font-medium text-rosegold">안경 끼고 설명 모드 👓</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-ink">{poi.name}</h1>
            </div>

            {/* 사진 */}
            <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-card bg-gradient-to-br from-rosegold-soft to-coral-soft shadow-soft">
              {poi.photoFile && !imgFailed ? (
                <img
                  src={wikimediaPhoto(poi.photoFile, 800)}
                  alt={poi.name}
                  loading="lazy"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-lg font-semibold text-rosegold">
                  {poi.name}
                </div>
              )}
            </div>

            {/* 강아지의 설명(큐레이션 팩트) */}
            <div className="mt-4 space-y-2 rounded-card bg-surface p-4 shadow-soft">
              {poi.blurb.map((line, i) => (
                <p key={i} className="text-sm text-charcoal">
                  🐾 {line}
                </p>
              ))}
            </div>

            {/* 액션 */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionLink onClick={openBooking} label={poi.bookingLabel ?? '예약·정보'} primary />
              <ActionLink onClick={openBlog} label="블로그 후기" />
              <a
                href={googleDirectionsUrl(poi.coords)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill border border-line bg-surface px-4 py-2.5 text-center text-sm font-semibold text-charcoal"
              >
                길찾기
              </a>
              <button
                type="button"
                onClick={askDog}
                className="rounded-pill border border-line bg-surface px-4 py-2.5 text-center text-sm font-semibold text-charcoal"
              >
                🐾 더 물어보기
              </button>
            </div>

            <button
              type="button"
              onClick={() => setView('choose')}
              className="mt-4 w-full text-center text-sm text-muted"
            >
              ← 뒤로
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ChoiceButton({
  emoji,
  label,
  hint,
  onClick,
  primary,
}: {
  emoji: string
  label: string
  hint: string
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-card px-5 py-4 text-left shadow-soft transition-transform active:scale-[0.98] ${
        primary ? 'bg-coral text-white' : 'bg-surface text-charcoal ring-1 ring-line'
      }`}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <span>
        <span className="block font-display font-bold">{label}</span>
        <span className={`block text-xs ${primary ? 'text-white/85' : 'text-muted'}`}>{hint}</span>
      </span>
    </button>
  )
}

function ActionLink({
  onClick,
  label,
  primary,
}: {
  onClick: () => void
  label: string
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-pill px-4 py-2.5 text-center text-sm font-semibold ${
        primary ? 'bg-coral text-white' : 'border border-line bg-surface text-charcoal'
      }`}
    >
      {label}
    </button>
  )
}
