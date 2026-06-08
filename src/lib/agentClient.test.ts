import { afterEach, describe, expect, it, vi } from 'vitest'
import { askAgent } from './agentClient'

afterEach(() => vi.unstubAllGlobals())

describe('agentClient', () => {
  it('정상 응답을 파싱한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ reply: '안녕!', actions: [{ type: 'navigate', to: '/map' }] }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }),
        ),
      ),
    )
    const r = await askAgent([{ role: 'user', content: '하이' }])
    expect(r.reply).toBe('안녕!')
    expect(r.actions).toEqual([{ type: 'navigate', to: '/map' }])
  })

  it('!ok 응답은 disabled 폴백', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('', { status: 503 }))))
    const r = await askAgent([{ role: 'user', content: '하이' }])
    expect(r.disabled).toBe(true)
    expect(r.actions).toEqual([])
  })

  it('네트워크 예외도 disabled 폴백', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('net'))))
    const r = await askAgent([{ role: 'user', content: '하이' }])
    expect(r.disabled).toBe(true)
  })
})
