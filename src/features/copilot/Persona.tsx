/**
 * 코파일럿 캐릭터 — 심플 2D 미니멀.
 * 시그니처 디테일 = 설명할 때 쓰는 안경(glasses prop).
 */
export default function Persona({ size = 40, glasses = true }: { size?: number; glasses?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="여행 가이드">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b76e79" />
          <stop offset="1" stopColor="#ff6f61" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#pg)" />
      {/* 얼굴 */}
      <circle cx="24" cy="22" r="13" fill="#fffdfa" />
      {/* 눈 */}
      <circle cx="19" cy="21" r="1.8" fill="#2b2b33" />
      <circle cx="29" cy="21" r="1.8" fill="#2b2b33" />
      {/* 미소 */}
      <path d="M19 27 Q24 31 29 27" stroke="#2b2b33" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* 안경(설명 모드) */}
      {glasses && (
        <g stroke="#2b2b33" strokeWidth="1.6" fill="none">
          <circle cx="19" cy="21" r="3.6" />
          <circle cx="29" cy="21" r="3.6" />
          <line x1="22.6" y1="21" x2="25.4" y2="21" />
        </g>
      )}
    </svg>
  )
}
