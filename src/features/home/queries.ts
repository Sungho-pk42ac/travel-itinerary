import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from '../../lib/openMeteo'
import { fetchFx } from '../../lib/fx'

const OSAKA = { lat: 34.6937, lng: 135.5023 }
const KYOTO = { lat: 35.0116, lng: 135.7681 }

/** 오사카·교토 날씨를 함께 가져온다. */
export function useWeather() {
  return useQuery({
    queryKey: ['weather', 'osaka-kyoto'],
    queryFn: async ({ signal }) => {
      const [osaka, kyoto] = await Promise.all([
        fetchWeather('오사카', OSAKA.lat, OSAKA.lng, signal),
        fetchWeather('교토', KYOTO.lat, KYOTO.lng, signal),
      ])
      return { osaka, kyoto }
    },
  })
}

/** KRW↔JPY 환율. */
export function useFx() {
  return useQuery({
    queryKey: ['fx', 'jpy'],
    queryFn: ({ signal }) => fetchFx(signal),
  })
}
