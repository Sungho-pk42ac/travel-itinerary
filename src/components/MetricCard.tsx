import type { ReactNode } from 'react'
import Skeleton from './Skeleton'

/**
 * 대시보드 지표 카드 — 로딩(스켈레톤)·에러(폴백)·정상 상태를 일관되게 표현.
 * 외부 API 실패가 앱을 깨지 않도록 에러도 카드 안에 격리.
 */
export default function MetricCard({
  title,
  icon,
  isLoading,
  isError,
  errorText = '불러오기 실패',
  children,
}: {
  title: string
  icon?: string
  isLoading?: boolean
  isError?: boolean
  errorText?: string
  children?: ReactNode
}) {
  return (
    <section className="rounded-card bg-surface p-4 shadow-soft">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-muted">
        {icon && <span aria-hidden>{icon}</span>}
        {title}
      </h2>
      <div className="mt-2">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : isError ? (
          <p className="text-sm text-danger">{errorText}</p>
        ) : (
          children
        )}
      </div>
    </section>
  )
}
