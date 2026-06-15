/*
 * AI 코파일럿 에이전트 — Vercel Edge 서버리스.
 * OpenAI function calling + 큐레이션 팩트 그라운딩 + 라이브 날씨 툴 + 네비 액션.
 * 키(OPENAI_API_KEY)는 서버 전용. 미설정 시 graceful 비활성(200 + disabled).
 */
export const config = { runtime: 'edge' }

const MODEL = 'gpt-4o-mini'

// 페르소나 + 그라운딩 팩트(우리 여행 범위 내에서만 답, 불확실하면 그렇다고 말함) + 앱 사용법.
const SYSTEM = `너는 박성호♥양세은 커플의 오사카 여행(2026-06-26~29, 3박4일) 전용 동행 가이드야.
성격: 따뜻하고 박식한 스토리텔러 친구. 친근한 반말. 설렘을 주되 잔소리는 안 해. 답은 짧고 친근하게(보통 2~4문장).
역할: 여행 안내 + 로컬 가이드(장소의 역사·문화 한입) + 이 앱 사용법 안내.

[여행 일정 팩트]
- 숙소: 6/26~28(2박) 오사카 난바 호텔 케이한 난바 그란데, 6/28~29(1박) 교토 아라시야마 온천 카덴쇼(교리츠 리조트 嵐山温泉 花伝抄).
- 예약완료: 간사이공항→난바 난카이 라피트, USJ 1일권(오후권 품절로 1일권 구매·오후 입장), 마리오카트 20:30, 교토 종일투어(Trip.com, 아마노하시다테·이네), 교토역→간사이공항 JR 하루카.
- Day1(6/26 금): KIX 도착(피치 MM712) → 난바 얼리체크인(짐 보관) → 난바 시내 가볍게 → USJ 1일권으로 오후 입장(슈퍼닌텐도월드+해리포터, 익스프레스권) → 난바 숙박.
- Day2(6/27 토): 오사카 난바 핫플 종일 — 도톤보리 글리코사인 → 신사이바시 쇼핑 → 구로몬 시장 해산물 → 돈키호테+에비스 대관람차 → 야간 공도 카트(★국제운전면허증 필수).
- Day3(6/28 일): 난바 체크아웃(짐 챙김) → 교토 종일투어(Trip.com 예약완료, 아마노하시다테·이네 후나야, 짐은 버스 보관, ★하차지 교토 확인) → 오사카로 복귀하지 않고 아라시야마 카덴쇼 체크인·온천(가이세키 석식 미정).
- Day4(6/29 월): 카덴쇼 조식·아침 온천 → 아라시야마 대나무숲·도게츠교 → 교토 시내 구경 → 교토에서 바로 KIX 출국(제주 7C1308 19:55).

[앱 사용법]
- 홈: D-day·지금/다음 일정·날씨·환율 환산기·예산. / 개요: 항공·정책·우리추억(버킷리스트). / Day1~4: 시간대 타임라인(장소 탭하면 정보·예약). / 지도: 핀·일자필터·길찾기. / 정보: API상태·비상연락처.

규칙: 위 팩트 범위에서만 단정해. 모르거나 불확실하면 "정확친 않을 수 있어"라고 솔직히 말해. 거짓 사실 날조 금지.
- 사용자를 특정 화면으로 데려가야 하면 navigate 툴을 써(to 예: /home /overview /day/2 /map /info /memory).
- 현지 날씨를 물으면 get_weather 툴을 써.`

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: '오사카 또는 교토의 현재 날씨와 예보를 가져온다.',
      parameters: {
        type: 'object',
        properties: { city: { type: 'string', enum: ['osaka', 'kyoto'] } },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navigate',
      description: '앱의 특정 화면으로 이동시킨다.',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string', description: '경로. 예: /home /overview /day/2 /map /info /memory' },
        },
        required: ['to'],
      },
    },
  },
]

const COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  osaka: { lat: 34.6937, lng: 135.5023, label: '오사카' },
  kyoto: { lat: 35.0116, lng: 135.7681, label: '교토' },
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

/**
 * 소프트 Origin 가드 — 앱 도메인(*.vercel.app)·localhost에서 온 요청만 허용.
 * 캐주얼/봇 abuse(무인증 엔드포인트로 OpenAI 쿼터 소모)를 낮추기 위함.
 * ⚠ Origin 헤더는 스푸핑 가능하므로 완전한 방어는 아님 — 강한 보호는 Vercel
 *   Firewall/Rate-Limit 권장(README 참고).
 */
function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('origin') || req.headers.get('referer') || ''
  if (!origin) return false
  try {
    const host = new URL(origin).hostname
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.vercel.app')
  } catch {
    return false
  }
}

/** 날씨 툴 실행(server) — open-meteo. */
async function runWeather(city: string): Promise<string> {
  const c = COORDS[city] ?? COORDS.osaka
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}` +
    `&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=3`
  try {
    const r = await fetch(url)
    if (!r.ok) return `${c.label} 날씨를 가져오지 못했어.`
    const d = (await r.json()) as {
      current?: { temperature_2m: number }
      daily?: { temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] }
    }
    const cur = d.current?.temperature_2m
    const max = d.daily?.temperature_2m_max?.[0]
    const min = d.daily?.temperature_2m_min?.[0]
    const pop = d.daily?.precipitation_probability_max?.[0]
    return `${c.label} 현재 ${cur ?? '?'}°, 오늘 ${min ?? '?'}~${max ?? '?'}°, 강수확률 ${pop ?? '?'}%.`
  } catch {
    return `${c.label} 날씨 조회 중 오류가 났어.`
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
  tool_call_id?: string
}

async function callOpenAI(key: string, messages: ChatMessage[]) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, tools: TOOLS, temperature: 0.6, max_tokens: 500 }),
  })
  if (!r.ok) throw new Error(`openai ${r.status}`)
  return (await r.json()) as {
    choices: Array<{ message: ChatMessage }>
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)
  if (!isAllowedOrigin(req)) return json({ error: 'forbidden_origin' }, 403)

  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return json({
      disabled: true,
      reply:
        '아직 코파일럿이 잠들어 있어요. 서버에 OPENAI_API_KEY가 설정되면 깨어나서 도와줄게요! 그동안은 탭으로 일정을 둘러봐 주세요.',
      actions: [],
    })
  }

  let body: { messages?: Array<{ role: 'user' | 'assistant'; content: string }>; context?: { tab?: string } }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return json({ error: 'bad_json' }, 400)
  }

  const history = (body.messages ?? []).slice(-10)
  const ctxLine = body.context?.tab ? `(사용자는 지금 ${body.context.tab} 화면에 있어.)` : ''

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM + (ctxLine ? `\n${ctxLine}` : '') },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ]

  const actions: Array<{ type: 'navigate'; to: string }> = []

  try {
    // 1차 호출
    const first = await callOpenAI(key, messages)
    const msg = first.choices[0]?.message
    if (!msg) return json({ reply: '응답을 못 받았어. 다시 시도해줄래?', actions })

    // 툴콜이 없으면 바로 응답
    if (!msg.tool_calls?.length) {
      return json({ reply: msg.content ?? '', actions })
    }

    // 툴 실행(1 라운드)
    messages.push({ role: 'assistant', content: msg.content, tool_calls: msg.tool_calls })
    for (const tc of msg.tool_calls) {
      let result = ''
      try {
        const args = JSON.parse(tc.function.arguments || '{}')
        if (tc.function.name === 'get_weather') {
          result = await runWeather(String(args.city ?? 'osaka'))
        } else if (tc.function.name === 'navigate') {
          const to = String(args.to ?? '/home')
          actions.push({ type: 'navigate', to })
          result = `이동 요청 접수: ${to}`
        } else {
          result = '알 수 없는 툴'
        }
      } catch {
        result = '툴 실행 오류'
      }
      messages.push({ role: 'tool', tool_call_id: tc.id, content: result })
    }

    // 2차 호출 — 최종 자연어 답
    const second = await callOpenAI(key, messages)
    const reply = second.choices[0]?.message?.content ?? '음, 다시 한 번 말해줄래?'
    return json({ reply, actions })
  } catch {
    return json({ reply: '잠깐 문제가 생겼어. 잠시 후 다시 시도해줄래?', actions }, 200)
  }
}
