import { describe, expect, it } from 'vitest'
import { jpyToKrw, parseFx } from './fx'
import { describeWeather, parseWeather } from './openMeteo'
import { dayTotals, formatKRW, grandTotal, parseKRW } from './budget'
import { getUpcoming } from './nextEvent'

describe('fx', () => {
  it('성공 응답에서 KRW 환율을 파싱한다', () => {
    const rate = parseFx({ result: 'success', rates: { KRW: 9.1 }, time_last_update_utc: 'x' })
    expect(rate.jpyToKrw).toBe(9.1)
  })
  it('실패/누락 응답은 throw', () => {
    expect(() => parseFx({ result: 'error' })).toThrow()
    expect(() => parseFx({ result: 'success', rates: {} })).toThrow()
  })
  it('100엔을 원화로 반올림 환산', () => {
    expect(jpyToKrw(100, { jpyToKrw: 9.13, updated: '' })).toBe(913)
  })
})

describe('openMeteo', () => {
  it('daily/current를 파싱하고 반올림한다', () => {
    const w = parseWeather('오사카', {
      current: { temperature_2m: 23.6, weather_code: 0 },
      daily: {
        time: ['2026-06-26'],
        temperature_2m_max: [28.4],
        temperature_2m_min: [21.9],
        precipitation_probability_max: [40],
        weather_code: [61],
      },
    })
    expect(w.current).toEqual({ temp: 24, code: 0 })
    expect(w.daily[0]).toEqual({ date: '2026-06-26', tMax: 28, tMin: 22, precipProb: 40, code: 61 })
  })
  it('weather code를 라벨로 매핑', () => {
    expect(describeWeather(0).label).toBe('맑음')
    expect(describeWeather(61).label).toBe('비')
  })
})

describe('budget', () => {
  it('₩ 금액 문자열을 숫자로 파싱', () => {
    expect(parseKRW('₩320,000(입장+익스프레스)')).toBe(320000)
    expect(parseKRW('쇼핑 별도')).toBe(0)
    expect(parseKRW(undefined)).toBe(0)
  })
  it('일자별 합계는 4일, 총합은 양수', () => {
    expect(dayTotals()).toHaveLength(4)
    expect(grandTotal()).toBeGreaterThan(0)
    expect(grandTotal()).toBe(dayTotals().reduce((s, d) => s + d.total, 0))
  })
  it('원화 포맷', () => {
    expect(formatKRW(320000)).toBe('₩320,000')
  })
})

describe('nextEvent', () => {
  it('여행 전이면 phase=before, next=Day1 첫 항목', () => {
    const r = getUpcoming(new Date('2026-06-01T12:00:00+09:00'))
    expect(r.phase).toBe('before')
    expect(r.next?.day).toBe(1)
    expect(r.current).toBeNull()
  })
  it('여행 중이면 current/next를 모두 채운다', () => {
    // Day2 13:00 → current=12:30 점심, next=13:30 구로몬
    const r = getUpcoming(new Date('2026-06-27T13:00:00+09:00'))
    expect(r.phase).toBe('during')
    expect(r.current?.day).toBe(2)
    expect(r.next?.time).toBe('13:30')
  })
  it('여행 후면 phase=after, next=null', () => {
    const r = getUpcoming(new Date('2026-07-01T12:00:00+09:00'))
    expect(r.phase).toBe('after')
    expect(r.next).toBeNull()
  })
})
