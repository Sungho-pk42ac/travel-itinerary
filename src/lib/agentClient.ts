/** AI 코파일럿 클라이언트 — /api/agent 호출(서버리스). 실패/미배포 시 graceful. */

export interface AgentAction {
  type: 'navigate'
  to: string
}

export interface AgentResponse {
  reply: string
  actions: AgentAction[]
  disabled?: boolean
}

export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
}

/** 에이전트에 질문. 네트워크/미배포/키미설정은 disabled 폴백으로 흡수. */
export async function askAgent(
  messages: AgentMessage[],
  context?: { tab?: string },
): Promise<AgentResponse> {
  try {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages, context }),
    })
    if (!res.ok) {
      return {
        reply:
          '지금은 코파일럿에 연결할 수 없어요. (로컬 미리보기이거나 서버에 키가 아직 없을 수 있어요.)',
        actions: [],
        disabled: true,
      }
    }
    const data = (await res.json()) as Partial<AgentResponse>
    return {
      reply: data.reply ?? '',
      actions: data.actions ?? [],
      disabled: data.disabled,
    }
  } catch {
    return { reply: '네트워크 문제로 연결하지 못했어요.', actions: [], disabled: true }
  }
}
