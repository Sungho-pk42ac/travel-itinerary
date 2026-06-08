import type { ReactNode } from 'react'

/**
 * 워킹 스켈레톤용 페이지 플레이스홀더.
 * 각 슬라이스 구현 시 실제 화면으로 교체된다.
 */
export default function PagePlaceholder({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <section aria-labelledby="page-title" className="space-y-4">
      <div className="rounded-card bg-surface p-5 shadow-soft">
        <h1 id="page-title" className="font-display text-2xl font-bold text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
