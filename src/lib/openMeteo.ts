/**
 * Open-Meteo 날씨 — 무료·키없음·CORS 허용.
 * 오사카/교토의 현재 날씨 + 일별 예보(최고/최저·강수확률)를 가져온다.
 * 실패 시 호출부(TanStack Query)가 에러/스켈레톤 폴백 처리.
 */

/** 일별 예보 항목. */
export interface DailyForecast {
  /** 'YYYY-MM-DD' */
  date: string
  tMax: number
  tMin: number
  /** 강수확률(%) */
  precipProb: number
  /** WMO weather code */
  code: number
}

/** 도시 단위 날씨 응답. */
export interface CityWeather {
  city: string
  current: { temp: number; code: number } | null
  daily: DailyForecast[]
}

/** WMO weather code → 한국어 라벨/이모지(간이). */
export function describeWeather(code: number): { label: string; icon: string } {
  if (code === 0) return { label: '맑음', icon: '☀️' }
  if (code <= 3) return { label: '구름조금', icon: '⛅' }
  if (code <= 48) return { label: '안개', icon: '🌫️' }
  if (code <= 67) return { label: '비', icon: '🌧️' }
  if (code <= 77) return { label: '눈', icon: '🌨️' }
  if (code <= 82) return { label: '소나기', icon: '🌦️' }
  if (code <= 99) return { label: '뇌우', icon: '⛈️' }
  return { label: '—', icon: '🌡️' }
}

interface OpenMeteoResponse {
  current?: { temperature_2m: number; weather_code: number }
  daily?: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    weather_code: number[]
  }
}

/** 응답 파싱(순수 함수, 테스트 용이). */
export function parseWeather(city: string, data: OpenMeteoResponse): CityWeather {
  const d = data.daily
  const daily: DailyForecast[] =
    d?.time.map((date, i) => ({
      date,
      tMax: Math.round(d.temperature_2m_max[i]),
      tMin: Math.round(d.temperature_2m_min[i]),
      precipProb: d.precipitation_probability_max[i] ?? 0,
      code: d.weather_code[i] ?? 0,
    })) ?? []
  return {
    city,
    current: data.current
      ? { temp: Math.round(data.current.temperature_2m), code: data.current.weather_code }
      : null,
    daily,
  }
}

/** 오사카/교토 등 좌표로 날씨 fetch. */
export async function fetchWeather(
  city: string,
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<CityWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
    `&timezone=Asia%2FTokyo&forecast_days=7`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`)
  return parseWeather(city, (await res.json()) as OpenMeteoResponse)
}
