import { expect, test } from '@playwright/test'

test.describe('AI 코파일럿', () => {
  test('플로팅 버튼 → 챗 열림 → 질문 보내면 응답(미배포 시 graceful)', async ({ page }) => {
    await page.goto('/home')
    await page.getByRole('button', { name: '여행 가이드 열기' }).click()

    const dialog = page.getByRole('dialog', { name: '여행 가이드' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText(/오사카 여행 가이드/)).toBeVisible()

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
})
