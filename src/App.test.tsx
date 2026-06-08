import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { getDDay } from './data/trip'

// 단위 테스트에서 외부 API 네트워크 차단 — 날씨/환율 fetch는 실패 폴백으로.
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('no network in test'))),
  )
})
afterEach(() => {
  vi.unstubAllGlobals()
})

function renderApp(initialPath = '/') {
  // 재시도 없는 격리된 QueryClient
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('App', () => {
  it('루트 진입 시 홈으로 리다이렉트되어 대시보드가 보인다', () => {
    renderApp('/')
    expect(screen.getByRole('navigation', { name: '주요 탐색' })).toBeInTheDocument()
    expect(screen.getByText('예상 경비 (2인)')).toBeInTheDocument()
    // 커플 이름(상단바/온보딩)
    expect(screen.getAllByText('박성호').length).toBeGreaterThan(0)
  })

  it('알 수 없는 경로는 홈으로 폴백된다', () => {
    renderApp('/nope')
    expect(screen.getByText('예상 경비 (2인)')).toBeInTheDocument()
  })

  it('Day 경로는 타임라인을 렌더한다', () => {
    renderApp('/day/1')
    expect(screen.getByRole('heading', { name: /USJ 오후 입장/ })).toBeInTheDocument()
  })
})

describe('getDDay', () => {
  it('출발 전이면 양수를 반환한다', () => {
    expect(getDDay(new Date('2026-06-20T00:00:00+09:00'))).toBe(6)
  })
  it('출발 당일이면 0을 반환한다', () => {
    expect(getDDay(new Date('2026-06-26T09:00:00+09:00'))).toBe(0)
  })
})
