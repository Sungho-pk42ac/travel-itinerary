import { QueryClient } from '@tanstack/react-query'

/**
 * 전역 TanStack Query 클라이언트.
 * 외부 API(날씨·환율)는 약간 stale 허용 + 재시도 1회로 앱 비차단.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10분
      gcTime: 1000 * 60 * 60, // 1시간
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
