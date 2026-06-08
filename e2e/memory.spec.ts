import { expect, test } from '@playwright/test'

test.describe('커플 메모리', () => {
  test('Overview에서 진입, 키 미설정 시 비활성 안내', async ({ page }) => {
    await page.goto('/overview')
    await page.getByRole('link', { name: /우리 추억/ }).click()
    await expect(page).toHaveURL(/\/memory$/)
    await expect(page.getByRole('heading', { name: /우리 추억/ })).toBeVisible()
    // CI엔 Supabase 키가 없으므로 비활성 안내 + 설정 단계 노출
    await expect(page.getByText('비활성')).toBeVisible()
    await expect(page.getByText('schema.sql')).toBeVisible()
  })
})
