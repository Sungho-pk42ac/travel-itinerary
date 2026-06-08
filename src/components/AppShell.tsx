import type { ReactNode } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

/** 앱 셸 — 상단 앱바 + 스크롤 콘텐츠 + 하단 탭 네비. */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-ivory">
      <TopBar />
      <main className="mx-auto w-full max-w-screen-sm flex-1 px-4 py-5">{children}</main>
      <BottomNav />
    </div>
  )
}
