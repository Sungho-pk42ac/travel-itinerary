import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import App from './App'
import { queryClient } from './app/queryClient'
import { getDDay } from './data/trip'

function renderApp(initialPath = '/') {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('App 워킹 스켈레톤', () => {
  it('루트 진입 시 홈으로 리다이렉트되어 D-day 카드가 보인다', () => {
    renderApp('/')
    // 커플 이름은 상단바에 노출
    expect(screen.getAllByText('박성호').length).toBeGreaterThan(0)
    // 하단 네비 8탭
    expect(screen.getByRole('navigation', { name: '주요 탐색' })).toBeInTheDocument()
  })

  it('알 수 없는 경로는 홈으로 폴백된다', () => {
    renderApp('/nope')
    expect(screen.getByText('우리 여행의 커맨드 센터')).toBeInTheDocument()
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
