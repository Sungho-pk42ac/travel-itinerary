import { trip } from '../data/trip'

/** 상단 앱바 — 아이덴티티(커플 이름 + 목적지). */
export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ivory/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-sm items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-charcoal font-display">
            {trip.partnerA}
          </span>
          <span className="text-coral" aria-hidden>
            ♥
          </span>
          <span className="text-base font-semibold text-charcoal font-display">
            {trip.partnerB}
          </span>
        </div>
        <span className="rounded-pill bg-rosegold-soft/60 px-3 py-1 text-xs font-medium text-rosegold">
          {trip.destination} OS
        </span>
      </div>
    </header>
  )
}
