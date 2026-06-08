/**
 * 환율 — open.er-api.com (무료·키없음).
 * base=JPY로 받아 KRW 환율(1엔당 원)을 추출. 100엔=₩ 환산에 사용.
 */
export interface FxRate {
  /** 1 JPY = ? KRW */
  jpyToKrw: number
  /** 응답 기준일(서버 제공) */
  updated: string
}

interface ErApiResponse {
  result: string
  time_last_update_utc?: string
  rates?: Record<string, number>
}

/** 응답 파싱(순수 함수). KRW 환율이 없으면 throw. */
export function parseFx(data: ErApiResponse): FxRate {
  const krw = data.rates?.KRW
  if (data.result !== 'success' || typeof krw !== 'number') {
    throw new Error('환율 데이터 형식 오류')
  }
  return { jpyToKrw: krw, updated: data.time_last_update_utc ?? '' }
}

/** 100엔을 원화로 환산(반올림). */
export function jpyToKrw(jpy: number, rate: FxRate): number {
  return Math.round(jpy * rate.jpyToKrw)
}

/** 환율 fetch. */
export async function fetchFx(signal?: AbortSignal): Promise<FxRate> {
  const res = await fetch('https://open.er-api.com/v6/latest/JPY', { signal })
  if (!res.ok) throw new Error(`er-api ${res.status}`)
  return parseFx((await res.json()) as ErApiResponse)
}
