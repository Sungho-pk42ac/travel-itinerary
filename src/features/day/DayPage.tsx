import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PagePlaceholder from '../../components/PagePlaceholder'
import Timeline from '../../components/Timeline'
import PoiDog from '../poi/PoiDog'
import { getDay } from '../../data/itinerary'
import { trip } from '../../data/trip'

/** Day N — 실제 일정 타임라인 + POI 바텀시트. */
export default function DayPage() {
  const { n } = useParams()
  const dayNum = Number(n)
  const day = getDay(dayNum)
  const [openPoi, setOpenPoi] = useState<string | null>(null)

  if (!day) {
    return <PagePlaceholder title="Day ?" subtitle={`1~${trip.totalDays}일차만 있어요`} />
  }

  return (
    <section className="space-y-4">
      <div className="rounded-card bg-surface p-5 shadow-soft">
        <p className="text-xs font-medium text-rosegold">
          Day {day.day} · {day.date} ({day.weekday})
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">{day.label}</h1>
      </div>
      <Timeline activities={day.activities} onSelect={setOpenPoi} />
      <PoiDog poiId={openPoi} onClose={() => setOpenPoi(null)} />
    </section>
  )
}
