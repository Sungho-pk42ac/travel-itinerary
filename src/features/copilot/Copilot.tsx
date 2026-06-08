import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomSheet from '../../components/BottomSheet'
import Persona from './Persona'
import { askAgent, type AgentMessage } from '../../lib/agentClient'

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

const GREETING =
  '안녕! 나는 너희 오사카 여행 가이드야 👓 일정·날씨·길찾기 뭐든 물어봐. "내일 뭐 해?" 같이 편하게!'

/** 떠다니는 AI 코파일럿 — 버튼 + 챗 시트. */
export default function Copilot() {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<ChatTurn[]>([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [turns, open])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    const next: ChatTurn[] = [...turns, { role: 'user', content: text }]
    setTurns(next)
    setInput('')
    setBusy(true)

    const history: AgentMessage[] = next
      .filter((t) => t.content)
      .map((t) => ({ role: t.role, content: t.content }))
    const res = await askAgent(history, { tab: location.pathname })
    setTurns((prev) => [...prev, { role: 'assistant', content: res.reply }])
    setBusy(false)

    // 네비 액션 실행(앱 내 경로만)
    for (const a of res.actions) {
      if (a.type === 'navigate' && a.to.startsWith('/')) navigate(a.to)
    }
  }

  return (
    <>
      {/* 플로팅 버튼 (하단 네비 위) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="여행 가이드 열기"
        className="fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-surface shadow-float ring-1 ring-line transition-transform active:scale-95"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
      >
        <Persona size={40} />
      </button>

      <BottomSheet open={open} title="여행 가이드" onClose={() => setOpen(false)}>
        <div className="flex h-[60vh] flex-col">
          <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto pr-1">
            {turns.map((t, i) => (
              <div
                key={i}
                className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    t.role === 'user'
                      ? 'bg-coral text-white'
                      : 'bg-cream text-charcoal'
                  }`}
                >
                  {t.content}
                </p>
              </div>
            ))}
            {busy && <p className="text-sm text-muted">가이드가 생각 중… 👓</p>}
          </div>

          <form onSubmit={send} className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 둘째 날 비 오면 어디 가?"
              aria-label="가이드에게 질문"
              disabled={busy}
              className="flex-1 rounded-pill border border-line bg-ivory px-4 py-2.5 text-sm focus:border-coral focus:outline-none disabled:opacity-60"
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
