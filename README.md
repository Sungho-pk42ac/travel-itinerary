# 🌸 Osaka Travel OS — 박성호 ♥ 양세은

2026.06.26(금) ~ 06.29(월) · 2인 · 첫 해외 커플 마일스톤 여행을 위한 **둘 전용 여행 동반자 앱**.
USJ · 나라 사슴 · 교토 종일투어 · 야간 공도 카트 · 미슐랭 가성비를 담은, "진짜 SaaS 앱 같은" 경험.

> 정적 브로슈어가 아니라 **살아있는 프로덕트** — 온보딩 · 실시간 위젯(날씨·환율) · 대시보드 ·
> 인터랙티브 지도 · (예정) 커플 메모리 · AI 코파일럿.

## 🧱 스택
**Vite · React · TypeScript · Tailwind CSS v4 · React Router · Zustand · TanStack Query ·
React Leaflet · vite-plugin-pwa** — **Vercel** 배포.

디자인 시스템은 **"Osaka Romance OS"** (Ivory·Warm Cream·Rose Gold·Coral / Plus Jakarta Sans + Pretendard).
디자인 토큰은 `src/index.css`의 Tailwind `@theme`에 락(lock).

## 📁 구조 (요약)
```
src/
├─ main.tsx · App.tsx · router.tsx
├─ index.css            # Osaka Romance OS 디자인 토큰(@theme)
├─ app/                 # store(Zustand) · queryClient(TanStack) · nav
├─ data/                # trip 메타데이터 · (예정) itinerary/poi/places
├─ components/          # AppShell · TopBar · BottomNav · ...
└─ features/            # home · overview · day · map · info (+ onboarding/copilot 예정)
e2e/                    # Playwright(모바일) 스모크
```

## 🖥️ 로컬 개발
```bash
npm install
npm run dev        # 개발 서버
npm run build      # 타입체크 + 프로덕션 빌드
npm run preview    # 빌드 결과 미리보기
```

## ✅ 검증
```bash
npm run typecheck  # tsc
npm run lint       # eslint
npm run test       # vitest (단위)
npm run test:e2e   # playwright (모바일 e2e, build 필요)
```
PR마다 GitHub Actions CI(typecheck·lint·vitest·build + playwright)가 돌고, Vercel이 프리뷰를 배포합니다.
또한 **Claude가 PR 변경분을 자동 코드리뷰**(`.github/workflows/claude-review.yml`)해 코멘트로 남깁니다.
`main` 머지 = 프로덕션 자동 배포.

## 🔐 환경변수 (`.env.local`, gitignore)
| 키 | 용도 | 노출 |
|---|---|---|
| `VITE_GOOGLE_MAPS_KEY` | Google Maps/Places/Directions (선택, 없으면 Leaflet 폴백) | 브라우저(리퍼러 제한 필수) |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | 커플 메모리 (선택, 없으면 비활성) | 브라우저(RLS 보호) |
| `OPENAI_API_KEY` | AI 코파일럿 서버리스 (선택) | **서버 전용** |

모든 외부 키 기능은 **키 미설정 시 graceful 폴백** — 키 없이도 앱이 동작합니다.

> 🔐 AI 코파일럿(`/api/agent`)은 무인증 엔드포인트라 소프트 Origin 가드(앱 도메인만)를 두었습니다.
> Origin은 스푸핑 가능하므로, 비용 abuse를 강하게 막으려면 **Vercel Firewall/Rate-Limit**을 권장합니다.
> 채팅에 노출된 모든 키(OpenAI·Supabase·PAT 등)는 **rotate(재발급)** 하세요.

## 🗓️ 일정 요약
| Day | 날짜 | 핵심 |
|---|---|---|
| 1 | 6/26 금 | KIX 도착 · **USJ 오후권(닌텐도+해리포터)** · USJ인근 숙박 |
| 2 | 6/27 토 | 호텔이동 · 나라 사슴 · 구로몬 해산물 · 도톤보리·메가돈키 · **야간 공도 카트** |
| 3 | 6/28 일 | **교토 종일투어**(아마노하시다테·이네·미야마) · 오사카 복귀 |
| 4 | 6/29 월 | 쇼핑 · **미슐랭 가성비 런치** · KIX 출국 |

## 🪪 출발 전 필수
- **국제운전면허증(IDP)** 2인 — 야간 공도 카트 필수
- 미슐랭 런치 · 카트 예약 / 교토투어 집결지·시간 재확인

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
