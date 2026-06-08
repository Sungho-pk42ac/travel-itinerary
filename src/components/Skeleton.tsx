/** 로딩 스켈레톤 — pulse 애니메이션(reduced-motion 시 정적). */
export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-line/70 ${className}`} aria-hidden />
}
