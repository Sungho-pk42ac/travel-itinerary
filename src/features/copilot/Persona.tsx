/**
 * 코파일럿 캐릭터 — 심플 2D 강아지 가이드.
 * 시그니처 디테일 = 똑똑한 가이드를 상징하는 동그란 안경(glasses).
 */
export default function Persona({ size = 40, glasses = true }: { size?: number; glasses?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="강아지 여행 가이드">
      <defs>
        <linearGradient id="dogbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbeae2" />
          <stop offset="1" stopColor="#ffd9d4" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#dogbg)" />

      {/* 귀 (늘어진 플로피) */}
      <path d="M12 16 Q8 22 11 31 Q15 30 16 23 Z" fill="#b76e79" />
      <path d="M36 16 Q40 22 37 31 Q33 30 32 23 Z" fill="#b76e79" />

      {/* 얼굴 */}
      <circle cx="24" cy="24" r="11.5" fill="#fffdfa" />

      {/* 눈 */}
      <circle cx="20" cy="22.5" r="1.7" fill="#2b2b33" />
      <circle cx="28" cy="22.5" r="1.7" fill="#2b2b33" />

      {/* 주둥이 + 코 */}
      <ellipse cx="24" cy="29" rx="5.5" ry="4" fill="#fbeae2" />
      <ellipse cx="24" cy="27" rx="1.9" ry="1.5" fill="#2b2b33" />
      {/* 입 */}
      <path d="M24 28.5 L24 30.5 M24 30.5 Q21.5 32 20 30.5 M24 30.5 Q26.5 32 28 30.5"
        stroke="#2b2b33" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* 볼터치 */}
      <circle cx="16.5" cy="27" r="1.6" fill="#ffb7ad" opacity="0.7" />
      <circle cx="31.5" cy="27" r="1.6" fill="#ffb7ad" opacity="0.7" />

      {/* 안경(똑똑한 가이드 디테일) */}
      {glasses && (
        <g stroke="#2b2b33" strokeWidth="1.4" fill="none">
          <circle cx="20" cy="22.5" r="3.3" />
          <circle cx="28" cy="22.5" r="3.3" />
          <line x1="23.3" y1="22.5" x2="24.7" y2="22.5" />
        </g>
      )}
    </svg>
  )
}
