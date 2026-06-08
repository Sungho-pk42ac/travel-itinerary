# Project PRD: Osaka Travel OS

> 사용자 제공 PRD (디자인/제품 기준 문서). 실제 디자인은 보유 디자인 스킬로 고도화.

## 1. Product Vision
**Osaka Travel OS** — 박성호 ♥ 양세은 커플의 오사카·교토·나라 여행(2026.06.26~06.29) 전용
프라이빗·프리미엄 모바일 퍼스트 동반 앱. 정적 일정표를 실시간 유틸리티·감성·스마트 가이드를 갖춘
"살아있는 OS"로 전환.

## 2. Target Audience
- 박성호 & 양세은 (커플). 로맨틱·하이엔드·효율 지향 오사카 탐험.

## 3. Product Principles
- Premium SaaS 미감(블로그/스크랩북 아님), 따뜻함·로맨스, 오프라인 우선 신뢰성, AI 코파일럿 가이드.

## 4. Key Features
- **Command Center(Home):** 동적 D-day·다음활동 카운트다운, 라이브 위젯(날씨 Open-Meteo·환율 KRW/JPY·예산 게이지), Quick Actions(지도·번역·코파일럿).
- **Smart Itinerary(Day1~4):** 수직 타임라인·리치 POI 카드, 코파일럿 맥락 팁, 예약/비용 상태.
- **AI Copilot:** 캐릭터(심플, 설명 시 안경), 떠다니는 버튼 + 챗시트. *(3D 강아지 아님 — 사용자 정정)*
- **Translation & Phrasebook:** 카테고리 문구, 풀스크린 포인트-투-쇼, 완전 오프라인.
- **Offline & System Stability:** 오프라인 배너·캐시 표시, 스켈레톤 로딩, API 헬스/PWA 설치 패널.

## 5. Visual Language
- 색: Ivory `#F4FAFD`, Cream, Rose Gold, Coral 하이라이트, Charcoal 텍스트.
- 폰트: Plus Jakarta Sans.
- 컴포넌트: 라운드 8–12px, 서브틀 글래스모피즘, 소프트 섀도.
- 마스코트: 심플 캐릭터(설명 시 안경). *실제 비주얼·디자인은 보유 디자인 스킬로 제작.*

## 6. Technical Assumptions
- React + TypeScript + Tailwind, Zustand, TanStack Query(오프라인 persist), Vercel(PWA).
- APIs: Open-Meteo, Exchangerate-API(open.er-api), OpenStreetMap/Leaflet. (+ Google Places/Directions, OpenAI 서버리스 — 사용자 추가)

## 7. Success Metrics
- 유틸리티(여행 중 길찾기·번역 사용 빈도), 감성("케어받는" 느낌), 성능(저신호 지하철에서도 무마찰·오프라인).
