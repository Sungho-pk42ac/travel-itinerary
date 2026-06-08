import { useParams } from 'react-router-dom'
import PagePlaceholder from '../../components/PagePlaceholder'
import { trip } from '../../data/trip'

/** Day N — 시간대 타임라인(추후 슬라이스). 유효 범위 밖이면 안내. */
export default function DayPage() {
  const { n } = useParams()
  const dayNum = Number(n)
  const valid = Number.isInteger(dayNum) && dayNum >= 1 && dayNum <= trip.totalDays

  return (
    <PagePlaceholder
      title={valid ? `Day ${dayNum}` : 'Day ?'}
      subtitle={valid ? '시간대별 일정' : `1~${trip.totalDays}일차만 있어요`}
    />
  )
}
