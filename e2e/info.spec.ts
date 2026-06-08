import { expect, test } from '@playwright/test'

test.describe('정보', () => {
  test('API 상태·비상연락처·개인정보가 보인다', async ({ page }) => {
    await page.goto('/info')
    await expect(page.getByRole('heading', { name: 'API 상태' })).toBeVisible()
    await expect(page.getByText('날씨 (Open-Meteo)')).toBeVisible()
    // 비상 연락처
    await expect(page.getByRole('link', { name: '110' })).toBeVisible()
    await expect(page.getByRole('link', { name: '119' })).toBeVisible()
    // 개인정보 정책
    await expect(page.getByRole('heading', { name: /개인정보/ })).toBeVisible()
  })
})
