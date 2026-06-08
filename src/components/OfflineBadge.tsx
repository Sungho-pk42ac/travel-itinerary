import { useEffect, useState } from 'react'

/** 오프라인 시 상단에 고지하는 배지(온/오프라인 이벤트 구독). */
export default function OfflineBadge() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (online) return null

  return (
    <div
      role="status"
      className="bg-charcoal px-4 py-1.5 text-center text-xs font-medium text-ivory"
    >
      오프라인 — 저장된 일정·지도는 계속 볼 수 있어요
    </div>
  )
}
