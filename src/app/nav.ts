/**
 * 하단 탭 네비게이션 모델 (8탭).
 * Home · Overview · Day1~4 · Map · Info — IA는 plan v2 확정.
 */
export interface NavItem {
  /** 라우트 경로 */
  to: string
  /** 짧은 라벨(탭) */
  label: string
  /** 접근성 풀 라벨 */
  full: string
}

export const navItems: NavItem[] = [
  { to: '/home', label: '홈', full: '홈 대시보드' },
  { to: '/overview', label: '개요', full: '여행 개요' },
  { to: '/day/1', label: 'DAY1', full: 'Day 1 일정' },
  { to: '/day/2', label: 'DAY2', full: 'Day 2 일정' },
  { to: '/day/3', label: 'DAY3', full: 'Day 3 일정' },
  { to: '/day/4', label: 'DAY4', full: 'Day 4 일정' },
  { to: '/map', label: '지도', full: '지도' },
  { to: '/info', label: '정보', full: '정보' },
]
