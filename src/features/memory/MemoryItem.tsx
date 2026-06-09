import { useCallback, useEffect, useState } from 'react'
import {
  addComment,
  listComments,
  listReactions,
  toggleReaction,
  type Comment,
  type Memory,
  type Reaction,
} from '../../lib/supabase'

const EMOJIS = ['❤️', '😂', '😮', '🥹', '👍']

/**
 * 추억 한 개 + 댓글 + 이모지 리액션.
 * rev가 바뀌면(실시간 변경) 댓글/리액션을 다시 불러온다.
 */
export default function MemoryItem({
  memory,
  author,
  rev,
}: {
  memory: Memory
  author: string
  rev: number
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [text, setText] = useState('')
  const [showComments, setShowComments] = useState(false)

  const load = useCallback(async () => {
    try {
      const [c, r] = await Promise.all([
        listComments('memory', memory.id),
        listReactions('memory', memory.id),
      ])
      setComments(c)
      setReactions(r)
    } catch {
      /* 실패 시 조용히 무시(앱 비차단) */
    }
  }, [memory.id])

  useEffect(() => {
    load()
  }, [load, rev])

  const mine = reactions.find((r) => r.author === author)

  const react = async (emoji: string) => {
    try {
      await toggleReaction({
        targetType: 'memory',
        targetId: memory.id,
        author,
        emoji,
        existing: mine,
      })
      await load()
    } catch {
      /* noop */
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      await addComment({ targetType: 'memory', targetId: memory.id, author, text: text.trim() })
      setText('')
      await load()
    } catch {
      /* noop */
    }
  }

  const counts = EMOJIS.map((e) => ({
    emoji: e,
    count: reactions.filter((r) => r.emoji === e).length,
    active: mine?.emoji === e,
  }))

  return (
    <li className="rounded-lg bg-cream/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-rosegold">{memory.author}</span>
        <span className="text-[11px] text-muted">{memory.created_at.slice(0, 10)}</span>
      </div>
      <p className="mt-1 text-sm text-charcoal">{memory.text}</p>

      {/* 리액션 */}
      <div className="mt-2 flex flex-wrap gap-1">
        {counts.map((c) => (
          <button
            key={c.emoji}
            type="button"
            onClick={() => react(c.emoji)}
            aria-pressed={c.active}
            className={`flex items-center gap-0.5 rounded-pill px-2 py-0.5 text-xs transition-colors ${
              c.active ? 'bg-coral-soft text-coral' : 'bg-surface text-muted hover:bg-ivory'
            }`}
          >
            <span>{c.emoji}</span>
            {c.count > 0 && <span className="tabular-nums">{c.count}</span>}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="rounded-pill bg-surface px-2 py-0.5 text-xs text-muted hover:bg-ivory"
        >
          💬 {comments.length > 0 ? comments.length : '댓글'}
        </button>
      </div>

      {/* 댓글 */}
      {showComments && (
        <div className="mt-2 space-y-2 border-t border-line pt-2">
          {comments.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="font-semibold text-rosegold">{c.author}</span>{' '}
              <span className="text-charcoal">{c.text}</span>
            </div>
          ))}
          {comments.length === 0 && <p className="text-xs text-muted">첫 댓글을 남겨보세요.</p>}
          <form onSubmit={submit} className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="댓글…"
              aria-label="댓글 입력"
              className="flex-1 rounded-lg border border-line bg-ivory px-3 py-1.5 text-sm focus:border-coral focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-pill bg-coral px-3 py-1.5 text-xs font-semibold text-white"
            >
              등록
            </button>
          </form>
        </div>
      )}
    </li>
  )
}
