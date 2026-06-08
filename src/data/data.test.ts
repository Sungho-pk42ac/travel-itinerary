import { describe, expect, it } from 'vitest'
import { allActivities, getDay, itinerary } from './itinerary'
import { getPoi, pois } from './poi'
import { trip } from './trip'
import { wikimediaPhoto } from '../lib/wikimedia'

describe('itinerary 데이터 무결성', () => {
  it('여행 일수만큼 Day가 있고 날짜가 trip 범위와 일치한다', () => {
    expect(itinerary).toHaveLength(trip.totalDays)
    expect(itinerary[0].date).toBe(trip.startDate)
    expect(itinerary.at(-1)!.date).toBe(trip.endDate)
  })

  it('day 번호는 1..N으로 연속한다', () => {
    expect(itinerary.map((d) => d.day)).toEqual([1, 2, 3, 4])
    expect(getDay(2)?.weekday).toBe('토')
  })

  it('모든 활동의 시간은 HH:MM 형식이고 하루 안에서 비내림차순이다', () => {
    for (const day of itinerary) {
      const mins = day.activities.map((a) => {
        expect(a.time).toMatch(/^\d{2}:\d{2}$/)
        const [h, m] = a.time.split(':').map(Number)
        return h * 60 + m
      })
      const sorted = [...mins].sort((x, y) => x - y)
      expect(mins).toEqual(sorted)
    }
  })

  it('활동의 poiId는 모두 존재하는 POI를 가리킨다', () => {
    for (const a of allActivities()) {
      if (a.poiId) expect(getPoi(a.poiId), `${a.poiId} 누락`).toBeDefined()
    }
  })
})

describe('poi 데이터 무결성', () => {
  it('id는 유일하다', () => {
    const ids = pois.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('좌표는 유효 범위(일본 근방)이고 blurb는 1줄 이상이다', () => {
    for (const p of pois) {
      expect(p.coords.lat).toBeGreaterThan(33)
      expect(p.coords.lat).toBeLessThan(36)
      expect(p.coords.lng).toBeGreaterThan(134)
      expect(p.coords.lng).toBeLessThan(136.5)
      expect(p.blurb.length).toBeGreaterThan(0)
    }
  })
})

describe('wikimediaPhoto', () => {
  it('파일명을 URL 인코딩하고 width 쿼리를 붙인다', () => {
    const url = wikimediaPhoto('Nara Park - panoramio (2).jpg', 400)
    expect(url).toContain('Special:FilePath/')
    expect(url).toContain('Nara%20Park')
    expect(url).toContain('width=400')
  })
})
