import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/*
 * Supabase 클라이언트 — 커플 공유 메모리(추억·버킷리스트).
 * ⚠ 프론트는 anon 키만 사용(RLS로 보호). service_role/DB비번 절대 금지.
 * 키 미설정 시 모든 기능이 graceful 비활성(앱 비차단).
 *
 * 신규 "깨끗한" Supabase 프로젝트를 만들고 supabase/schema.sql을 실행한 뒤
 * VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 를 .env.local·Vercel에 주입하면 활성화된다.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

/** 환경변수가 모두 있으면 Supabase 기능 활성. */
export function isSupabaseEnabled(): boolean {
  return Boolean(url && anon)
}

let client: SupabaseClient | null = null

/** 싱글톤 클라이언트(미설정 시 null). */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseEnabled()) return null
  if (!client) client = createClient(url as string, anon as string)
  return client
}

export interface Memory {
  id: string
  day: number | null
  author: string
  text: string
  photo_url: string | null
  created_at: string
}

export interface BucketItem {
  id: string
  label: string
  done: boolean
  done_by: string | null
  done_at: string | null
}

/** 추억 목록(최신순). */
export async function listMemories(): Promise<Memory[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Memory[]
}

/** 추억 추가. */
export async function addMemory(input: { author: string; text: string; day?: number | null }) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase 비활성')
  const { error } = await sb
    .from('memories')
    .insert({ author: input.author, text: input.text, day: input.day ?? null })
  if (error) throw error
}

/** 버킷리스트 목록. */
export async function listBucket(): Promise<BucketItem[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb
    .from('bucket_list')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as BucketItem[]
}

/** 버킷 항목 추가. */
export async function addBucketItem(label: string) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase 비활성')
  const { error } = await sb.from('bucket_list').insert({ label })
  if (error) throw error
}

/** 버킷 완료 토글. */
export async function toggleBucket(item: BucketItem, by: string) {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase 비활성')
  const next = !item.done
  const { error } = await sb
    .from('bucket_list')
    .update({ done: next, done_by: next ? by : null, done_at: next ? new Date().toISOString() : null })
    .eq('id', item.id)
  if (error) throw error
}

/** 추억·버킷 변경을 실시간 구독. 정리 함수 반환. */
export function subscribeRealtime(onChange: () => void): () => void {
  const sb = getSupabase()
  if (!sb) return () => {}
  const channel = sb
    .channel('couple-memory')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'memories' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bucket_list' }, onChange)
    .subscribe()
  return () => {
    sb.removeChannel(channel)
  }
}
