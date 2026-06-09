import { describe, expect, it } from 'vitest'
import {
  getSupabase,
  isSupabaseEnabled,
  listBucket,
  listComments,
  listMemories,
  listReactions,
} from './supabase'

// 테스트 환경엔 VITE_SUPABASE_* 미설정 → 비활성 경로 검증
describe('supabase (미설정 시 graceful 비활성)', () => {
  it('isSupabaseEnabled는 false', () => {
    expect(isSupabaseEnabled()).toBe(false)
  })
  it('getSupabase는 null', () => {
    expect(getSupabase()).toBeNull()
  })
  it('목록 함수는 빈 배열을 반환(throw 안 함)', async () => {
    await expect(listMemories()).resolves.toEqual([])
    await expect(listBucket()).resolves.toEqual([])
    await expect(listComments('memory', 'x')).resolves.toEqual([])
    await expect(listReactions('memory', 'x')).resolves.toEqual([])
  })
})
