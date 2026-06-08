import type { LatLng } from '../lib/maps'

/** POI 카테고리 — 아이콘/색상 매핑에 사용. */
export type PoiCategory = 'attraction' | 'food' | 'shopping' | 'activity' | 'transport'

/** 관심 지점(Point of Interest). */
export interface Poi {
  /** 안정적 식별자(일정 항목과 연결) */
  id: string
  /** 표시 이름 */
  name: string
  category: PoiCategory
  /** 2~3줄 소개 */
  blurb: string[]
  /** Wikimedia Commons 파일명(검증된 것만). 없으면 UI가 그라데이션 폴백 */
  photoFile?: string
  /** 위경도(Leaflet 마커·구글맵 길찾기) */
  coords: LatLng
  /** 예약/정보 외부 링크 */
  bookingUrl?: string
  /** 예약 버튼 라벨 */
  bookingLabel?: string
  /** Google place_id — 추후 Places 보강(사진·평점·영업시간)용. 미확정은 생략 */
  placeId?: string
}

/**
 * 오사카·나라·교토 POI 10종.
 * 사진은 Special:FilePath 200 검증된 5종만 채우고, 나머지는 폴백.
 * 좌표는 공개 지도 기준 근사값(마커/길찾기 용도).
 */
export const pois: Poi[] = [
  {
    id: 'usj',
    name: '유니버설 스튜디오 재팬',
    category: 'attraction',
    blurb: [
      '슈퍼 닌텐도 월드 + 위저딩 월드 오브 해리포터가 핵심.',
      '오후권이라 익스프레스 패스로 인기 어트랙션 회전율 확보.',
    ],
    photoFile: 'Universal Studios Japan 2019,08.jpg',
    coords: { lat: 34.6654, lng: 135.4323 },
    bookingUrl: 'https://www.usj.co.jp/web/en/us',
    bookingLabel: 'USJ 공식 예매',
  },
  {
    id: 'nara',
    name: '나라공원 · 도다이지 대불',
    category: 'attraction',
    blurb: [
      '자유롭게 노니는 사슴과 인사하고, 세계 최대 목조건축 도다이지 대불을 본다.',
      '비 오면 나라국립박물관(실내)으로 대체 가능.',
    ],
    photoFile: 'Nara Park - panoramio (2).jpg',
    coords: { lat: 34.6851, lng: 135.8407 },
    bookingLabel: '구글맵',
  },
  {
    id: 'kuromon',
    name: '구로몬 시장',
    category: 'food',
    blurb: [
      '"오사카의 부엌" — 참치·성게·장어·가리비를 즉석에서.',
      '아케이드라 우천에도 OK. 여친 최애 해산물 코스.',
    ],
    coords: { lat: 34.665, lng: 135.5061 },
    bookingLabel: '구글맵',
  },
  {
    id: 'dotonbori',
    name: '도톤보리 · 글리코 사인',
    category: 'attraction',
    blurb: [
      '오사카 대표 야경 포토존. 글리코 러너 앞 인생샷.',
      '강변 + 아케이드로 우천에도 동선 유지.',
    ],
    photoFile: 'Dotonbori, Osaka, at night, November 2016.jpg',
    coords: { lat: 34.6687, lng: 135.5013 },
    bookingLabel: '구글맵',
  },
  {
    id: 'donki',
    name: '돈키호테 도톤보리 · 에비스타워 관람차',
    category: 'shopping',
    blurb: [
      '여친 최애 메가 돈키 + 강변 대관람차로 커플 야경.',
      '실내 쇼핑이라 비와 무관.',
    ],
    coords: { lat: 34.6694, lng: 135.5015 },
    bookingLabel: '구글맵',
  },
  {
    id: 'kart',
    name: '스트리트 카트 (야간 공도 카트)',
    category: 'activity',
    blurb: [
      '마리오 분장으로 오사카 도심 야경을 달리는 시그니처 체험.',
      '★ 국제운전면허증(IDP) 지참 필수 · 사전 예약 필수.',
    ],
    coords: { lat: 34.6628, lng: 135.504 },
    bookingUrl: 'https://kart.st/',
    bookingLabel: 'Street Kart 예약',
  },
  {
    id: 'kyoto',
    name: '교토 종일투어 · 아마노하시다테',
    category: 'activity',
    blurb: [
      'Klook 전세버스 종일투어 — 아마노하시다테·이네 후나야·미야마 가야부키.',
      '집결지(오사카 vs 교토역)·점심 포함 여부 사전 확인.',
    ],
    photoFile: 'Amanohashidate aerial view 2026.jpg',
    coords: { lat: 35.5717, lng: 135.1937 },
    bookingUrl: 'https://www.klook.com/activity/141243/',
    bookingLabel: 'Klook 투어(예약완료)',
  },
  {
    id: 'michelin',
    name: '미슐랭 1스타 가성비 런치',
    category: 'food',
    blurb: [
      '마일스톤 피날레 — 디너 대비 절반 가격의 스타 런치 코스.',
      '예약 필수. 미슐랭 가이드/타베로그로 확인.',
    ],
    coords: { lat: 34.672, lng: 135.5015 },
    bookingUrl: 'https://guide.michelin.com/',
    bookingLabel: '미슐랭 가이드',
  },
  {
    id: 'shinsai',
    name: '신사이바시스지 쇼핑',
    category: 'shopping',
    blurb: [
      '패션·화장품·드럭스토어 상비약까지. 전 구간 아케이드(우천 OK).',
      '출국일 막판 쇼핑 동선.',
    ],
    photoFile: 'Shinsaibashi Osaka Japan01-r.jpg',
    coords: { lat: 34.6723, lng: 135.5008 },
    bookingLabel: '구글맵',
  },
  {
    id: 'kix',
    name: '간사이 국제공항 (KIX)',
    category: 'transport',
    blurb: [
      '인/아웃 게이트웨이. T2(피치/제주항공).',
      '난카이 라피트/급행으로 난바 45~70분.',
    ],
    coords: { lat: 34.432, lng: 135.2304 },
    bookingLabel: '구글맵',
  },
]

/** id로 POI 조회. */
export function getPoi(id: string): Poi | undefined {
  return pois.find((p) => p.id === id)
}
