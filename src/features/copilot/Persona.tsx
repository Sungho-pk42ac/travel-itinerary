/**
 * 코파일럿 캐릭터 — 더 귀여운 2D 강아지 가이드.
 * 큰 반짝이는 눈 + 동그란 코 + 혀 + 발그레한 볼.
 * 시그니처 디테일 = 똑똑한 가이드를 상징하는 동그란 안경(glasses).
 */
export default function Persona({ size = 40, glasses = true }: { size?: number; glasses?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="강아지 여행 가이드">
      <defs>
        <radialGradient id="dogbg" cx="50%" cy="38%" r="72%">
          <stop offset="0" stopColor="#fff4ee" />
          <stop offset="1" stopColor="#ffd9d4" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#dogbg)" />

      {/* 플로피 귀 */}
      <ellipse cx="13.5" cy="22" rx="4.6" ry="7.2" transform="rotate(-18 13.5 22)" fill="#b76e79" />
      <ellipse cx="34.5" cy="22" rx="4.6" ry="7.2" transform="rotate(18 34.5 22)" fill="#b76e79" />
      <ellipse cx="14" cy="22" rx="2.4" ry="4.4" transform="rotate(-18 14 22)" fill="#e8c9ce" />
      <ellipse cx="34" cy="22" rx="2.4" ry="4.4" transform="rotate(18 34 22)" fill="#e8c9ce" />

      {/* 얼굴 */}
      <circle cx="24" cy="23" r="12" fill="#fffdfa" />

      {/* 볼터치 */}
      <circle cx="15.8" cy="27.5" r="2.3" fill="#ffb3ab" opacity="0.7" />
      <circle cx="32.2" cy="27.5" r="2.3" fill="#ffb3ab" opacity="0.7" />

      {/* 큰 눈 + 반짝임 */}
      <circle cx="19.6" cy="22.6" r="2.9" fill="#2b2b33" />
      <circle cx="28.4" cy="22.6" r="2.9" fill="#2b2b33" />
      <circle cx="20.5" cy="21.6" r="1.05" fill="#fff" />
      <circle cx="29.3" cy="21.6" r="1.05" fill="#fff" />
      <circle cx="18.7" cy="23.4" r="0.5" fill="#fff" />
      <circle cx="27.5" cy="23.4" r="0.5" fill="#fff" />

      {/* 코 */}
      <ellipse cx="24" cy="27.2" rx="1.9" ry="1.5" fill="#2b2b33" />
      <circle cx="23.4" cy="26.7" r="0.5" fill="#fff" opacity="0.8" />

      {/* 입 + 혀 */}
      <path
        d="M24 28.4 L24 29.6 M24 29.6 Q21.6 31.2 20.4 29.9 M24 29.6 Q26.4 31.2 27.6 29.9"
        stroke="#2b2b33"
        strokeWidth="1.05"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="24" cy="30.7" rx="1.7" ry="1.25" fill="#ff8a99" />

      {/* 안경(똑똑한 가이드 디테일) */}
      {glasses && (
        <g stroke="#2b2b33" strokeWidth="1.3" fill="none">
          <circle cx="19.6" cy="22.6" r="4.1" />
          <circle cx="28.4" cy="22.6" r="4.1" />
          <line x1="23.7" y1="22.6" x2="24.3" y2="22.6" />
        </g>
      )}
    </svg>
  )
}
