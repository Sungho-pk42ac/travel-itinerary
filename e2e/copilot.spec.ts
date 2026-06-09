import { expect, test } from '@playwright/test'

test.describe('AI 코파일럿', () => {
  test('플로팅 버튼 → 챗 열림 → 질문 보내면 응답(미배포 시 graceful)', async ({ page }) => {
    await page.goto('/home')
    await page.getByRole('button', { name: '여행 가이드 열기' }).click()

    const dialog = page.getByRole('dialog', { name: '강아지 가이드' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText(/뭐든 물어봐/)).toBeVisible()

    // 입력 — 제어 컴포넌트 상태 커밋을 toHaveValue로 보장한 뒤 전송
    const input = dialog.getByLabel('가이드에게 질문')
    await input.fill('내일 뭐 해?')
    await expect(input).toHaveValue('내일 뭐 해?')
    await dialog.getByRole('button', { name: '보내기' }).click()

    // 내 메시지 + 어시스턴트 응답(라이브 또는 graceful) → 말풍선 3개 이상
    await expect(async () => {
      const count = await dialog.locator('p.rounded-2xl').count()
      expect(count).toBeGreaterThanOrEqual(3)
    }).toPass({ timeout: 10000 })
  })

  test('입력창이 한 글자씩 타이핑해도 포커스를 잃지 않는다(회귀)', async ({ page }) => {
    await page.goto('/home')
    await page.getByRole('button', { name: '여행 가이드 열기' }).click()
    const dialog = page.getByRole('dialog', { name: '강아지 가이드' })
    const input = dialog.getByLabel('가이드에게 질문')
    // 키 입력을 하나씩 보내 포커스 강탈 시 글자 누락을 잡는다
    await input.pressSequentially('내일 일정 알려줘', { delay: 30 })
    await expect(input).toHaveValue('내일 일정 알려줘')
    await expect(input).toBeFocused()
  })
})
