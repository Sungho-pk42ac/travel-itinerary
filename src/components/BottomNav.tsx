import { NavLink } from 'react-router-dom'
import { navItems } from '../app/nav'

/**
 * 하단 탭 네비게이션 (8탭, 가로 스크롤).
 * 8개라 모바일에서 넘칠 수 있어 가로 스크롤 + 활성 탭 강조.
 */
export default function BottomNav() {
  return (
    <nav
      aria-label="주요 탐색"
      className="sticky bottom-0 z-20 border-t border-line bg-surface/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-screen-sm gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none]">
        {navItems.map((item) => (
          <li key={item.to} className="shrink-0">
            <NavLink
              to={item.to}
              aria-label={item.full}
              className={({ isActive }) =>
                [
                  'flex min-w-[3.25rem] flex-col items-center rounded-pill px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-coral text-white'
                    : 'text-muted hover:bg-cream hover:text-charcoal',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
