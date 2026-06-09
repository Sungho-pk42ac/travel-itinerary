import { useCallback, useEffect, useState } from 'react'
import MemoryItem from './MemoryItem'
import {
  addBucketItem,
  addMemory,
  isSupabaseEnabled,
  listBucket,
  listMemories,
  subscribeRealtime,
  toggleBucket,
  type BucketItem,
  type Memory,
} from '../../lib/supabase'
import { trip } from '../../data/trip'

const UNLOCK_KEY = 'osaka-mem-unlocked'
const AUTHOR_KEY = 'osaka-mem-author'

/** 커플 공유 메모리 — 비활성/게이트/활성 3상태. */
export default function MemoryPage() {
  if (!isSupabaseEnabled()) return <DisabledState />
  return <MemoryApp />
}

/** Supabase 미설정 안내. */
function DisabledState() {
  return (
    <section className="space-y-3">
      <div className="rounded-card bg-surface p-5 shadow-soft">
        <h1 className="font-display text-xl font-bold text-ink">우리 추억 · 버킷리스트</h1>
        <p className="mt-2 text-sm text-muted">
          두 폰이 실시간 동기화되는 공유 추억 로그 기능입니다. 현재 <b>비활성</b> 상태예요.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-charcoal">
          <li>전용 Supabase 새 프로젝트 생성(기존 재사용 금지)</li>
          <li>
            <code>supabase/schema.sql</code> 실행
          </li>
          <li>
            <code>VITE_SUPABASE_URL</code> · <code>VITE_SUPABASE_ANON_KEY</code> 를 .env.local·Vercel에
            주입
          </li>
        </ol>
        <p className="mt-3 text-[11px] text-muted">
          anon 키만 사용(RLS 보호). 민감정보는 저장하지 않습니다.
        </p>
      </div>
    </section>
  )
}

/** 활성 상태: passphrase 게이트 → 추억/버킷. */
function MemoryApp() {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(UNLOCK_KEY) === '1')
  if (!unlocked) return <PassphraseGate onUnlock={() => setUnlocked(true)} />
  return <MemoryBoard />
}

function PassphraseGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const expected = import.meta.env.VITE_COUPLE_PASSPHRASE

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = expected ? value === expected : value.trim().length > 0
    if (!ok) {
      setError(true)
      return
    }
    localStorage.setItem(UNLOCK_KEY, '1')
    onUnlock()
  }

  return (
    <section className="rounded-card bg-surface p-5 shadow-soft">
      <h1 className="font-display text-xl font-bold text-ink">🔐 우리만의 암호</h1>
      <p className="mt-1 text-sm text-muted">둘만 아는 암호를 입력하면 추억 공간이 열려요.</p>
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          aria-label="공유 암호"
          className="flex-1 rounded-lg border border-line bg-ivory px-3 py-2 text-sm focus:border-coral focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-pill bg-coral px-4 py-2 text-sm font-semibold text-white"
        >
          열기
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-danger">암호가 맞지 않아요.</p>}
      <p className="mt-3 text-[11px] text-muted">
        ※ 저민감 추억 데이터용 소프트 게이트입니다(완전한 보안 아님).
      </p>
    </section>
  )
}

function MemoryBoard() {
  const [author, setAuthor] = useState(() => localStorage.getItem(AUTHOR_KEY) || trip.partnerA)
  const [memories, setMemories] = useState<Memory[]>([])
  const [bucket, setBucket] = useState<BucketItem[]>([])
  const [text, setText] = useState('')
  const [bucketLabel, setBucketLabel] = useState('')
  const [error, setError] = useState<string | null>(null)
  // 실시간 변경 시 증가 → 각 MemoryItem이 댓글/리액션을 다시 로드
  const [rev, setRev] = useState(0)

  const refresh = useCallback(async () => {
    try {
      const [m, b] = await Promise.all([listMemories(), listBucket()])
      setMemories(m)
      setBucket(b)
      setRev((v) => v + 1)
      setError(null)
    } catch {
      setError('불러오기에 실패했어요. 잠시 후 다시 시도해 주세요.')
    }
  }, [])

  useEffect(() => {
    refresh()
    const unsub = subscribeRealtime(refresh)
    return unsub
  }, [refresh])

  const chooseAuthor = (a: string) => {
    setAuthor(a)
    localStorage.setItem(AUTHOR_KEY, a)
  }

  const submitMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      await addMemory({ author, text: text.trim() })
      setText('')
      await refresh()
    } catch {
      setError('추억 저장에 실패했어요.')
    }
  }

  const submitBucket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bucketLabel.trim()) return
    try {
      await addBucketItem(bucketLabel.trim())
      setBucketLabel('')
      await refresh()
    } catch {
      setError('버킷 추가에 실패했어요.')
    }
  }

  return (
    <div className="space-y-4">
      {/* 작성자 선택 */}
      <div className="flex items-center gap-2 rounded-card bg-surface p-3 shadow-soft">
        <span className="text-sm text-muted">작성자</span>
        {[trip.partnerA, trip.partnerB].map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => chooseAuthor(a)}
            aria-pressed={author === a}
            className={`rounded-pill px-3 py-1 text-sm font-medium ${
              author === a ? 'bg-coral text-white' : 'bg-cream text-muted'
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-danger">{error}</p>}

      {/* 버킷리스트 */}
      <section className="rounded-card bg-surface p-4 shadow-soft">
        <h2 className="font-display text-lg font-bold text-ink">🪣 버킷리스트</h2>
        <ul className="mt-3 space-y-2">
          {bucket.map((b) => (
            <li key={b.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleBucket(b, author).then(refresh)}
                aria-pressed={b.done}
                className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                  b.done ? 'border-coral bg-coral' : 'border-line'
                }`}
                aria-label={b.done ? '완료 해제' : '완료'}
              />
              <span className={`flex-1 text-sm ${b.done ? 'text-muted line-through' : 'text-charcoal'}`}>
                {b.label}
              </span>
              {b.done && b.done_by && <span className="text-[11px] text-rosegold">{b.done_by}</span>}
            </li>
          ))}
          {bucket.length === 0 && <li className="text-sm text-muted">아직 없어요. 추가해 보세요!</li>}
        </ul>
        <form onSubmit={submitBucket} className="mt-3 flex gap-2">
          <input
            value={bucketLabel}
            onChange={(e) => setBucketLabel(e.target.value)}
            placeholder="가보고 싶은 곳 / 하고 싶은 것"
            aria-label="버킷 항목"
            className="flex-1 rounded-lg border border-line bg-ivory px-3 py-2 text-sm focus:border-coral focus:outline-none"
          />
          <button type="submit" className="rounded-pill bg-coral px-4 py-2 text-sm font-semibold text-white">
            추가
          </button>
        </form>
      </section>

      {/* 추억 로그 */}
      <section className="rounded-card bg-surface p-4 shadow-soft">
        <h2 className="font-display text-lg font-bold text-ink">💌 추억 로그</h2>
        <form onSubmit={submitMemory} className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="오늘의 한 줄 추억"
            aria-label="추억 입력"
            className="flex-1 rounded-lg border border-line bg-ivory px-3 py-2 text-sm focus:border-coral focus:outline-none"
          />
          <button type="submit" className="rounded-pill bg-coral px-4 py-2 text-sm font-semibold text-white">
            남기기
          </button>
        </form>
        <ul className="mt-3 space-y-2">
          {memories.map((m) => (
            <MemoryItem key={m.id} memory={m} author={author} rev={rev} />
          ))}
          {memories.length === 0 && <li className="text-sm text-muted">첫 추억을 남겨보세요 🩷</li>}
        </ul>
      </section>
    </div>
  )
}
