import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomSheet from '../../components/BottomSheet'
import Persona from './Persona'
import { askAgent, type AgentMessage } from '../../lib/agentClient'

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

const GREETING =
  '멍! 나는 너희 오사카 여행 강아지 가이드야 🐾👓 일정·날씨·길찾기 뭐든 물어봐. "내일 뭐 해?" 같이 편하게!'

const BUBBLE_HINT = '멍! 뭐 도와줄까? 🐾'

/** 떠다니는 AI 코파일럿(강아지) — 버튼 + 말풍선 + 챗 시트. */
export default function Copilot() {
  const [open, setOpen] = useState(false)
  const [bubble, setBubble] = useState(false)
  const [turns, setTurns] = useState<ChatTurn[]>([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const turnsRef = useRef(turns)
  turnsRef.current = turns
  const busyRef = useRef(false)

  // 진입 후(스플래시 뒤) 말풍선을 잠깐 띄워 대화를 유도
  useEffect(() => {
    const show = window.setTimeout(() => setBubble(true), 2200)
    const hide = window.setTimeout(() => setBubble(false), 9000)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setBubble(false)
    // 열면 바로 입력 가능하도록 포커스(BottomSheet 패널 포커스 뒤에)
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [turns, open])

  const sendText = async (raw: string) => {
    const text = raw.trim()
    if (!text || busyRef.current) return
    const next: ChatTurn[] = [...turnsRef.current, { role: 'user', content: text }]
    setTurns(next)
    setInput('')
    busyRef.current = true
    setBusy(true)

    const history: AgentMessage[] = next.map((t) => ({ role: t.role, content: t.content }))
    const res = await askAgent(history, { tab: window.location.pathname })
    setTurns((prev) => [...prev, { role: 'assistant', content: res.reply }])
    busyRef.current = false
    setBusy(false)
    // 카톡처럼 연속 입력 — 전송 후에도 입력창 포커스 유지
    inputRef.current?.focus()

    for (const a of res.actions) {
      if (a.type === 'navigate' && a.to.startsWith('/')) navigate(a.to)
    }
  }

  // PoiDog 등에서 "🐾 더 물어보기" → 코파일럿 열고 자동 질문
  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<{ q?: string }>).detail?.q
      setOpen(true)
      setBubble(false)
      if (q) void sendText(q)
    }
    window.addEventListener('osaka:ask', handler)
    return () => window.removeEventListener('osaka:ask', handler)
    // sendText는 ref 기반이라 마운트 시 1회 등록으로 충분
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void sendText(input)
  }

  return (
    <>
      {/* 플로팅 강아지 + 말풍선 (하단 네비 위) */}
      <div
        className="fixed right-4 z-30 flex flex-col items-end gap-2"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
      >
        {bubble && !open && (
          <div className="relative max-w-[12rem] animate-[bubblepop_0.25s_ease] rounded-2xl rounded-br-sm bg-surface px-3 py-2 text-sm text-charcoal shadow-float ring-1 ring-line">
            {BUBBLE_HINT}
            <button
              type="button"
              onClick={() => setBubble(false)}
              aria-label="말풍선 닫기"
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] text-ivory"
            >
              ✕
            </button>
            <span className="absolute -bottom-1 right-4 h-3 w-3 rotate-45 bg-surface ring-1 ring-line [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="여행 가이드 열기"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-surface shadow-float ring-1 ring-line transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <Persona size={42} />
        </button>
      </div>

      <BottomSheet open={open} title="강아지 가이드" onClose={() => setOpen(false)}>
        <div className="flex h-[60vh] flex-col">
          <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto pr-1">
            {turns.map((t, i) => (
              <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    t.role === 'user' ? 'bg-coral text-white' : 'bg-cream text-charcoal'
                  }`}
                >
                  {t.content}
                </p>
              </div>
            ))}
            {busy && <p className="text-sm text-muted">강아지가 킁킁 생각 중… 🐾</p>}
          </div>

          <form onSubmit={onSubmit} className="mt-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 둘째 날 비 오면 어디 가?"
              aria-label="가이드에게 질문"
              enterKeyHint="send"
              className="flex-1 rounded-pill border border-line bg-ivory px-4 py-2.5 text-sm focus:border-coral focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-pill bg-coral px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              보내기
            </button>
          </form>
        </div>
      </BottomSheet>
    </>
  )
}
