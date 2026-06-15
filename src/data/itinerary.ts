/**
 * 일정 데이터 — 단일 소스(single source of truth).
 * 모든 화면(Home 다음일정·Day 타임라인·Map 필터)이 이 데이터를 공유한다.
 *
 * 2026-06 오사카·교토 3박4일 확정 동선:
 *  - 6/26~28(2박) 오사카 난바 · 호텔 케이한 난바 그란데
 *  - 6/28~29(1박) 교토 아라시야마 온천 · 카덴쇼(교리츠 리조트, 嵐山温泉 花伝抄)
 *  - 6/29 교토에서 바로 KIX로 출국(오사카 복귀 없음)
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
    label: 'KIX 도착 · 난바 얼리체크인 · USJ 오후권',
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
        title: '난바 이동 · 케이한 난바 그란데 얼리체크인(짐 보관)',
        reason: '도착 동선 · 짐 먼저 내려놓기',
        transport: '난카이 라피트/급행 약 45분',
        cost: '₩20,000(ICOCA)',
        note: '체크인 전이라 객실 대신 짐만 프런트 보관',
        rain: 'indoor',
      },
      {
        time: '12:00',
        title: '난바 첫끼 · 가벼운 시내 산책',
        reason: 'USJ 전 워밍업 · 오사카 첫 분위기',
        transport: '도보',
        cost: '₩30,000',
        meal: '난바 라멘/타코야키 가볍게',
        note: '본격 핫플은 27일에 집중 — 여긴 가볍게',
        rain: 'mixed',
      },
      {
        time: '13:30',
        title: '난바 → 유니버설시티 이동',
        reason: 'USJ 오후권 동선',
        transport: '지하철+JR 약 45분',
        cost: '₩12,000',
      },
      {
        time: '14:00',
        title: 'USJ 오후 입장 (닌텐도+해리포터)',
        reason: '마일스톤 핵심 체험',
        transport: '도보',
        cost: '₩320,000(오후권+익스프레스)',
        meal: '파크 내 테마푸드',
        note: '슈퍼닌텐도월드·해리포터 익스프레스권 필수 · 오후권이라 인기작은 익스프레스로 회전율 확보',
        poiId: 'usj',
        highlight: true,
        rain: 'mixed',
      },
      {
        time: '20:00',
        title: '유니버설 시티워크 저녁',
        reason: '파크 직결·야경',
        transport: '도보',
        cost: '₩48,000',
        meal: '이자카야/버거',
        note: '실내몰(우천 OK)',
        rain: 'indoor',
      },
      {
        time: '21:30',
        title: '난바 복귀 · 케이한 난바 그란데 체크인',
        reason: '휴식 · 본 객실 입실',
        transport: '지하철+JR 약 45분',
        cost: '₩180,000(숙박)',
        note: '난바역 도보권 · 2박 연박이라 27일 짐 그대로',
        rain: 'indoor',
      },
    ],
  },
  {
    day: 2,
    date: '2026-06-27',
    weekday: '토',
    label: '오사카 난바 핫플 종일 · 시장 · 야간 카트',
    activities: [
      {
        time: '10:00',
        title: '도톤보리 글리코사인 · 강변 산책',
        reason: '오사카 대표 야경/포토존 낮버전',
        transport: '호텔에서 도보',
        meal: '간식(타코야키)',
        note: '강변+아케이드라 우천에도 동선 유지',
        poiId: 'dotonbori',
        rain: 'mixed',
      },
      {
        time: '11:30',
        title: '신사이바시스지 쇼핑',
        reason: '패션·화장품·드럭스토어 핫플',
        transport: '도보',
        meal: '쇼핑 별도',
        note: '전 구간 아케이드(우천 OK)',
        poiId: 'shinsai',
        rain: 'indoor',
      },
      {
        time: '12:30',
        title: '점심: 오사카 명물',
        reason: '소울푸드',
        transport: '도보',
        cost: '₩40,000',
        meal: '오코노미야키/쿠시카츠',
        note: '실내',
        rain: 'indoor',
      },
      {
        time: '13:30',
        title: '구로몬 시장',
        reason: '여친 최애 해산물',
        transport: '도보',
        cost: '₩55,000',
        meal: '참치·성게·장어·가리비',
        note: '쿠로몬 아케이드(실내)',
        poiId: 'kuromon',
        highlight: true,
        rain: 'indoor',
      },
      {
        time: '15:30',
        title: '돈키호테 도톤보리점 + 에비스 대관람차',
        reason: '여친 최애 메가돈키·커플 관람차',
        transport: '도보',
        cost: '₩12,000(관람차)',
        meal: '간식',
        note: '실내 쇼핑(우천 OK)',
        poiId: 'donki',
        rain: 'indoor',
      },
      {
        time: '18:00',
        title: '저녁: 도톤보리 맛집',
        reason: '오사카 명물 디너',
        transport: '도보',
        cost: '₩48,000',
        meal: '스시/오코노미야키',
        note: '실내',
        rain: 'indoor',
      },
      {
        time: '20:30',
        title: '야간 공도 카트 (스트리트 카트)',
        reason: '마리오 분장 야경 주행',
        transport: '도보',
        cost: '₩140,000',
        note: '★ 국제운전면허증(IDP) 지참 필수 · 사전 예약',
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
    label: '난바 체크아웃 · Klook 교토투어 · 아라시야마 온천 료칸',
    activities: [
      {
        time: '08:00',
        title: '케이한 난바 그란데 체크아웃 · 짐 챙기기',
        reason: '교토로 이동(오사카 복귀 없음)',
        transport: '호텔',
        cost: '₩8,000(조식)',
        meal: '호텔/근처 조식',
        note: '캐리어 전부 챙겨 나오기',
        rain: 'indoor',
      },
      {
        time: '08:30',
        title: 'Klook 투어 집결 · 짐 버스에 보관',
        reason: '관광 중 짐 핸들링 최소화',
        transport: '도보/지하철',
        note: '★ 하차지가 교토(교토역)인 투어인지 확인 — 오사카 복귀 투어면 짐도 오사카로 돌아옴. 귀중품은 휴대.',
        rain: 'indoor',
      },
      {
        time: '09:00',
        title: 'Klook 교토 종일투어',
        reason: '아마노하시다테·이네 후나야·미야마 가야부키',
        transport: '전세버스',
        note: '예약완료(별도) · 점심 포함여부 확인 · 우천시 투어사 진행 · 짐은 버스 보관',
        poiId: 'kyoto',
        highlight: true,
        rain: 'mixed',
      },
      {
        time: '18:00',
        title: '교토 하차 · 짐 회수',
        reason: '아라시야마로 이동',
        transport: '버스 → 교토역/아라시야마',
        note: '교토역 하차 기준 · 짐 회수 후 란덴/택시로 아라시야마',
        rain: 'mixed',
      },
      {
        time: '19:00',
        title: '아라시야마 카덴쇼 체크인 · 온천',
        reason: '온천 료칸 마일스톤 · 하루 피로 풀기',
        transport: '란덴 아라시야마역/택시',
        cost: '₩260,000(숙박, 1박)',
        note: '교리츠 리조트 嵐山温泉 花伝抄 · 노천온천 · 유카타',
        highlight: true,
        rain: 'indoor',
      },
      {
        time: '20:00',
        title: '저녁: 가이세키(미정) 또는 아라시야마 인근',
        reason: '하루 마무리',
        transport: '료칸 내/도보',
        cost: '₩90,000',
        meal: '가이세키 석식 또는 인근 식당',
        note: '★ 가이세키 미정 — 료칸 석식 시간(보통 18~19:30) 늦으면 인근 식당으로 대체',
        rain: 'indoor',
      },
    ],
  },
  {
    day: 4,
    date: '2026-06-29',
    weekday: '월',
    label: '카덴쇼 조식·온천 · 교토 시내 · KIX 출국',
    activities: [
      {
        time: '08:00',
        title: '카덴쇼 조식 · 아침 온천',
        reason: '료칸 핵심 마무리',
        transport: '료칸 내',
        cost: '₩0(숙박 포함)',
        meal: '료칸 조식',
        note: '체크아웃 보통 10:00~11:00',
        poiId: 'kadensho',
        highlight: true,
        rain: 'indoor',
      },
      {
        time: '10:00',
        title: '아라시야마 산책 (대나무숲·도게츠교·텐류지)',
        reason: '교토 대표 풍경 인생샷',
        transport: '도보',
        cost: '₩16,000(텐류지 입장)',
        note: '비 오면 텐류지 법당/카페(실내) 위주',
        poiId: 'arashiyama',
        rain: 'outdoor',
      },
      {
        time: '12:00',
        title: '교토 시내 구경 · 점심 (기온/니시키시장)',
        reason: '교토 마지막 정취',
        transport: '란덴/버스',
        cost: '₩55,000',
        meal: '교토 우동/오반자이',
        note: '짐은 교토역 코인락커 보관 권장',
        rain: 'mixed',
      },
      {
        time: '14:30',
        title: '교토역 → KIX 공항 이동',
        reason: '출국 버퍼 확보',
        transport: 'JR 하루카 특급 약 75~80분',
        cost: '₩40,000',
        note: '★ 19:55 출발 — 늦어도 16:30 도착 목표',
      },
      {
        time: '16:30',
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
