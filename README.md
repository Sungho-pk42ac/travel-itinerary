# 🌸 오사카 3박 4일 커플 여행 가이드

2026.06.26(금) ~ 06.29(월) · 성인 2명 · 대중교통 기반의 **감성 미니멀 슬라이드형 웹 여행 가이드**입니다.
야경·자연·로컬 맛집·우천 대체 동선을 한 화면씩 넘기며 볼 수 있습니다.

## ✨ 특징
- **슬라이드형 UI** — 키보드(← → ↑ ↓), 클릭 버튼, 스와이프, 닷 인디케이터로 이동
- **반응형** — 데스크탑(풀스크린 스냅) ↔ 모바일(세로 스크롤) 자동 전환
- **감성 미니멀 디자인** — 웜 아이보리 + 테라코타/세이지 포인트, 세리프 헤드라인
- **순수 정적** — 빌드 불필요(HTML/CSS/JS), Unsplash 이미지, Google Fonts
- **엑셀용 CSV** — `data/itinerary.csv` (UTF-8 BOM, 한글 안 깨짐)

## 📁 구조
```
travel-itinerary/
├─ index.html        # 슬라이드 12장
├─ css/styles.css    # 감성 미니멀 · 반응형
├─ js/main.js        # 슬라이드 네비게이션
└─ data/itinerary.csv# 엑셀 붙여넣기용 일정표
```

## 🖥️ 로컬에서 보기
별도 빌드 없이 `index.html`을 브라우저로 열면 됩니다.
(로컬 서버 권장) `npx serve` 또는 VS Code Live Server.

## 🚀 Vercel 배포
정적 사이트라 프레임워크 설정이 필요 없습니다.
1. [vercel.com](https://vercel.com) 로그인 → **Add New → Project**
2. **Import Git Repository** 에서 이 레포(`travel-itinerary`) 선택
3. **Framework Preset: Other**, Root/Build/Output 기본값 그대로 → **Deploy**
4. 발급된 `https://travel-itinerary-xxxx.vercel.app` 으로 접속

이후 `main` 브랜치에 푸시하면 자동 재배포됩니다.

## 🗓️ 일정 요약
| Day | 날짜 | 핵심 |
|---|---|---|
| 1 | 6/26 금 | 도착 · 호리에 카페 · 도톤보리 야경 |
| 2 | 6/27 토 | 나라 자연·사슴 · 우메다 공중정원 야경 |
| 3 | 6/28 일 | 오사카성 산책 · 쇼핑 · 도톤보리 야경 |
| 4 | 6/29 월 | 신세카이 레트로 · 쿠시카츠 · KIX 출국 |

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
