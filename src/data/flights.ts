/**
 * 항공편 요약 — 정보 + 항공사 예약확인 링크만.
 * ⚠ e-티켓/PNR 등 PII는 절대 포함하지 않는다(공개 레포).
 */
export interface FlightLeg {
  /** '가는 편' / '오는 편' */
  label: string
  airline: string
  flightNo: string
  /** 'ICN → KIX' */
  route: string
  date: string
  /** 출발/도착 시각 메모 */
  timeNote: string
  /** 항공사 예약확인 페이지 */
  airlineUrl: string
}

export const flights: FlightLeg[] = [
  {
    label: '가는 편',
    airline: '피치 항공',
    flightNo: 'MM712',
    route: 'ICN → KIX',
    date: '2026-06-26',
    timeNote: '09:20 KIX 도착',
    airlineUrl: 'https://www.flypeach.com/',
  },
  {
    label: '오는 편',
    airline: '제주항공',
    flightNo: '7C1308',
    route: 'KIX → ICN',
    date: '2026-06-29',
    timeNote: '19:55 KIX 출발',
    airlineUrl: 'https://www.jejuair.net/',
  },
]

/** 여행 정책/체크 카드 — 출발 전 필수·정책. */
export interface PolicyItem {
  icon: string
  title: string
  detail: string
}

export const policies: PolicyItem[] = [
  {
    icon: '🪪',
    title: '국제운전면허증(IDP) 2인',
    detail: '야간 공도 카트 필수. 인천공항에서도 발급 가능.',
  },
  {
    icon: '🎟️',
    title: '사전 예약 재확인',
    detail: 'USJ 익스프레스 · 미슐랭 런치 · 카트 · 교토투어 집결지/시간.',
  },
  {
    icon: '🔒',
    title: '개인정보 보호',
    detail: 'e-티켓/PNR은 앱에 싣지 않음 — 항공사 예약확인 링크로 대체.',
  },
  {
    icon: '🌧️',
    title: '장마 대비',
    detail: '실내 대체(박물관·아케이드·쇼핑)와 우천 민감도 칩으로 동선 조정.',
  },
]
