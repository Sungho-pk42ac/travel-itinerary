import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** 앱 전역 상태. splashDone은 세션 한정(비영속), 환산기 입력만 영속. */
interface AppState {
  /** 온보딩 스플래시가 이번 페이지 로드에서 끝났는지(라우트 전환 시 재노출 방지) */
  splashDone: boolean
  markSplashDone: () => void
  /** 환율 환산기 입력(엔). 영속. */
  jpyInput: number
  setJpyInput: (n: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      splashDone: false,
      markSplashDone: () => set({ splashDone: true }),
      jpyInput: 1000,
      setJpyInput: (n) => set({ jpyInput: Number.isFinite(n) && n >= 0 ? n : 0 }),
    }),
    {
      name: 'osaka-os',
      // 세션성 splashDone은 저장하지 않는다(매 페이지 로드 시 false로 시작)
      partialize: (s) => ({ jpyInput: s.jpyInput }),
    },
  ),
)
