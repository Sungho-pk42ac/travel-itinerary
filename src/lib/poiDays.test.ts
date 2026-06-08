import { describe, expect, it } from 'vitest'
import { poiDayMap, poisForDay } from './poiDays'
import { pois } from '../data/poi'

describe('poiDays', () => {
  it('USJ는 Day1, KIX는 Day1·Day4에 등장', () => {
    const m = poiDayMap()
    expect(m['usj']).toContain(1)
    expect(m['kix']).toEqual(expect.arrayContaining([1, 4]))
  })

  it('전체 필터는 모든 POI, Day 필터는 해당 일자 POI만', () => {
    expect(poisForDay(null)).toHaveLength(pois.length)
    const d1 = poisForDay(1).map((p) => p.id)
    expect(d1).toContain('usj')
    expect(d1).toContain('kix')
    expect(d1).not.toContain('kyoto') // Day3
  })
})
