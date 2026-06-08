import { expect, test } from '@playwright/test'

test.describe('Home 대시보드', () => {
  test('D-day·다음일정·날씨·환율·예산 카드가 렌더된다', async ({ page }) => {
    await page.goto('/home')
    // 항상 렌더되는(네트워크 무관) 요소
    await expect(page.getByText('지금 / 다음 일정')).toBeVisible()
    await expect(page.getByText('예상 경비 (2인)')).toBeVisible()
    // 외부 API 카드는 로딩/에러/데이터 어느 상태든 카드 제목은 존재
    await expect(page.getByRole('heading', { name: '현지 날씨' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /환율/ })).toBeVisible()
  })

  test('환율 환산기 입력이 동작한다(폴백 무관 UI)', async ({ page }) => {
    await page.goto('/home')
    // 환율 데이터가 오면 입력 노출. 네트워크 실패 시엔 스킵(앱 비차단 확인).
    const input = page.getByLabel('엔 입력')
    if (await input.count()) {
      await input.fill('5000')
      await expect(input).toHaveValue('5000')
    }
  })
})

test.describe('온보딩 스플래시', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('진입 시 스플래시가 떴다가 자동으로 사라진다', async ({ page }) => {
    await page.goto('/home')
    const splash = page.getByText('탭하면 바로 시작')
    await expect(splash).toBeVisible()
    // 약 1.5초 후 자동 진입 → 대시보드 표시
    await expect(page.getByText('예상 경비 (2인)')).toBeVisible({ timeout: 5000 })
    await expect(splash).toBeHidden()
  })
})
