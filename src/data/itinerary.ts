/**
 * 일정 데이터 — data/itinerary.csv를 타입 안전한 구조로 이관.
 * 모든 화면(Home 다음일정·Day 타임라인·Map 필터)이 이 단일 소스를 공유한다.
 */

/** 우천 민감도 — 야외/실내. */
export type RainSensitivity = 'outdoor' | 'indoor' | 'mixed'

/** 타임라인 한 항목. */
export interface Activity {
  /** 'HH:MM' (Asia/Tokyo) */
  time: string
  title: string
  /** 추천 이유 */
  reason?: string
  /** 이동 방법 */
  transport?: string
  /** 예상 비용(2인) 표시 문자열 */
  cost?: string
  /** 식사 추천 */
  meal?: string
  /** 비고/우천 대체 */
  note?: string
  /** 연결된 POI id(바텀시트/지도) */
  poiId?: string
  /** 하이라이트(마일스톤 핵심) */
  highlight?: boolean
  /** 우천 민감도 */
  rain?: RainSensitivity
}

/** 하루 일정. */
export interface Day {
  /** 1~4 */
  day: number
  /** 'YYYY-MM-DD' */
  date: string
  /** 요일 */
  weekday: string
  /** 한 줄 요약 라벨 */
  label: string
  activities: Activity[]
}

export const itinerary: Day[] = [
  {
    day: 1,
    date: '2026-06-26',
    weekday: '금',
    label: 'KIX 도착 · USJ 풀데이',
    activities: [
      {
        time: '09:20',
        title: 'KIX T2 도착 · 입국심사 · 수하물',
        reason: '여행 시작',
        transport: '피치 MM712',
        note: '위탁수하물 불포함(기내 반입 정리)',
        poiId: 'kix',
        rain: 'indoor',
      },
      {
        time: '11:00',
        title: 'KIX → 유니버설시티 이동',
        reason: 'USJ 직행 동선',
        transport: 'JR 간사이공항선+환승 약 70분',
        cost: '₩20,000(ICOCA)',
        note: '호텔 짐 보관/얼리체크인',
      },
      {
        time: '12:30',
        title: 'USJ 오후 입장 (닌텐도+해리포터)',
        reason: '마일스톤 핵심 체험',
        transport: '도보',
        cost: '₩320,000(입장+익스프레스)',
        meal: '파크 내 테마푸드',
        note: '슈퍼닌텐도월드·해리포터 익스프레스권 필수',
        poiId: 'usj',
        highlight: true,
        rain: 'mixed',
      },
      {
        time: '19:00',
        title: '유니버설 시티워크 저녁',
        reason: '파크 직결·야경',
        transport: '도보',
        cost: '₩45,000',
        meal: '이자카야/버거',
        note: '실내몰',
        rain: 'indoor',
      },
      {
        time: '20:30',
        title: 'USJ 인근 호텔 체크인',
        reason: '동선·휴식',
        cost: '₩160,000(숙박)',
        note: '유니버설시티역 도보권',
        rain: 'indoor',
      },
    ],
  },
  {
    day: 2,
    date: '2026-06-27',
    weekday: '토',
    label: '나라 사슴 · 구로몬 · 도톤보리 · 야간 카트',
    activities: [
      {
        time: '08:30',
        title: '체크아웃 → 난바 호텔 이동 · 짐 보관',
        reason: '호텔 변경일',
        transport: 'JR/지하철 약 40분',
        cost: '₩18,000',
        note: '난바권 호텔 짐만 맡기기',
      },
      {
        time: '09:30',
        title: '긴테쓰 닛폰바시 → 나라',
        reason: '사슴·대불 반나절',
        transport: '긴테쓰 급행 40분',
        cost: '₩14,000',
      },
      {
        time: '10:30',
        title: '나라공원 사슴 + 도다이지 대불',
        reason: '자연·웅장·인생샷',
        transport: '도보',
        cost: '₩12,000',
        note: '우천 시 나라국립박물관(실내)',
        poiId: 'nara',
        highlight: true,
        rain: 'outdoor',
      },
      {
        time: '13:30',
        title: '난바 복귀 → 구로몬 시장',
        reason: '여친 최애 해산물',
        transport: '긴테쓰+도보',
        cost: '₩55,000',
        meal: '참치·성게·장어·가리비',
        note: '쿠로몬 아케이드(실내)',
        poiId: 'kuromon',
        highlight: true,
        rain: 'indoor',
      },
      {
        time: '16:00',
        title: '도톤보리 글리코사인 · 강변',
        reason: '대표 야경 포토존',
        transport: '도보',
        note: '도톤보리 아케이드',
        poiId: 'dotonbori',
        rain: 'mixed',
      },
      {
        time: '17:00',
        title: '돈키호테 도톤보리점 + 에비스 대관람차',
        reason: '여친 최애 메가돈키·커플 관람차',
        transport: '도보',
        cost: '₩10,000(관람차)',
        meal: '간식',
        note: '실내 쇼핑(우천 OK)',
        poiId: 'donki',
        rain: 'indoor',
      },
      {
        time: '18:30',
        title: '저녁: 도톤보리 맛집',
        reason: '오사카 명물',
        transport: '도보',
        cost: '₩48,000',
        meal: '쿠시카츠/스시/오코노미야키',
        note: '실내',
        rain: 'indoor',
      },
      {
        time: '20:30',
        title: '야간 공도 카트 (스트리트 카트)',
        reason: '마리오 분장 야경 주행',
        transport: '도보',
        cost: '₩140,000',
        note: '★ 국제운전면허증(IDP) 지참 필수 · 예약',
        poiId: 'kart',
        highlight: true,
        rain: 'outdoor',
      },
    ],
  },
  {
    day: 3,
    date: '2026-06-28',
    weekday: '일',
    label: '교토 종일투어 · 오사카 복귀',
    activities: [
      {
        time: '07:30',
        title: '호텔 조식 · 투어 집결지 이동',
        reason: '교토 종일투어',
        transport: '지하철/도보',
        cost: '₩8,000',
        meal: '조식',
        note: '★ 집결지(오사카 vs 교토역) 확인',
      },
      {
        time: '08:00',
        title: '교토 Klook 종일투어',
        reason: '아마노하시다테·이네후나야·미야마',
        transport: '전세버스',
        note: '예약완료(별도) · 투어 점심 포함여부 확인 · 우천시 투어사 진행',
        poiId: 'kyoto',
        highlight: true,
        rain: 'mixed',
      },
      {
        time: '17:40',
        title: '투어 해산',
        reason: '일정 종료',
        transport: '버스',
      },
      {
        time: '18:00',
        title: '저녁 + 야경 (해산지 기준)',
        reason: '공백 채우기',
        transport: '지하철',
        cost: '₩60,000',
        meal: '기온/폰토초 or 우메다/도톤보리',
        note: '교토역 해산 시 기온 야경→복귀',
        rain: 'mixed',
      },
      {
        time: '20:30',
        title: '오사카 복귀 · 숙박',
        reason: '휴식',
        transport: '지하철',
        cost: '₩150,000(숙박)',
        note: '난바권 호텔',
        rain: 'indoor',
      },
    ],
  },
  {
    day: 4,
    date: '2026-06-29',
    weekday: '월',
    label: '쇼핑 · 미슐랭 런치 · KIX 출국',
    activities: [
      {
        time: '09:00',
        title: '체크아웃 · 짐 보관',
        reason: '출국일',
        transport: '호텔',
        cost: '₩8,000(코인락커)',
      },
      {
        time: '09:30',
        title: '신사이바시스지 · 드럭스토어 쇼핑',
        reason: '패션·화장품·상비약',
        transport: '지하철 20분',
        meal: '쇼핑 별도',
        note: '전구간 아케이드(우천 OK)',
        poiId: 'shinsai',
        rain: 'indoor',
      },
      {
        time: '12:00',
        title: '점심: 미슐랭 1스타 가성비 런치',
        reason: '마일스톤 피날레(예약필수)',
        transport: '도보',
        cost: '₩130,000',
        meal: '스타 런치 코스(디너 대비 절반)',
        note: '예약 권장 · 미슐랭가이드 확인',
        poiId: 'michelin',
        highlight: true,
        rain: 'indoor',
      },
      {
        time: '14:00',
        title: '돈키호테 본격 구매 + 짐 회수',
        reason: '기념품·간식 막판몰기',
        transport: '도보',
        meal: '쇼핑 별도',
        note: '실내',
        rain: 'indoor',
      },
      {
        time: '16:00',
        title: '난바 → KIX 공항 이동',
        reason: '출국 버퍼 확보',
        transport: '난카이 라피트/급행 45~70분',
        cost: '₩20,000',
      },
      {
        time: '17:00',
        title: 'KIX T2 체크인 · 면세 · 출국',
        reason: '여행 마무리 (19:55 출발)',
        meal: '공항 식사',
        note: '제주 7C1308',
        poiId: 'kix',
        rain: 'indoor',
      },
    ],
  },
]

/** 특정 일자 조회. */
export function getDay(day: number): Day | undefined {
  return itinerary.find((d) => d.day === day)
}

/** 모든 활동을 (day 포함) 평탄화 — 다음 일정 계산 등에 사용. */
export function allActivities(): Array<Activity & { day: number; date: string }> {
  return itinerary.flatMap((d) =>
    d.activities.map((a) => ({ ...a, day: d.day, date: d.date })),
  )
}
