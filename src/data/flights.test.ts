import { describe, expect, it } from 'vitest'
import { flights, policies } from './flights'

describe('flights 데이터', () => {
  it('가는/오는 편 2개, 항공사 링크 존재', () => {
    expect(flights).toHaveLength(2)
    for (const f of flights) {
      expect(f.airlineUrl).toMatch(/^https:\/\//)
      expect(f.flightNo).toBeTruthy()
    }
  })

  it('PII(e-티켓/예약번호/PNR) 필드를 포함하지 않는다', () => {
    const serialized = JSON.stringify(flights).toLowerCase()
    expect(serialized).not.toMatch(/pnr|e-?ticket|passport|여권|예약번호/)
  })

  it('정책 카드는 IDP·개인정보 항목을 포함', () => {
    const titles = policies.map((p) => p.title).join(' ')
    expect(titles).toContain('IDP')
    expect(titles).toContain('개인정보')
  })
})
