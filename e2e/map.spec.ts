import { expect, test } from '@playwright/test'

test.describe('지도', () => {
  test('Leaflet 지도 + 마커 + 일자 필터가 동작한다', async ({ page }) => {
    await page.goto('/map')
    await expect(page.getByRole('heading', { name: '지도' })).toBeVisible()

    // Leaflet 컨테이너 렌더
    await expect(page.locator('.leaflet-container')).toBeVisible()

    // 전체: 모든 장소(10개) 표시
    await expect(page.getByText('10개 장소 표시')).toBeVisible()

    // D3(교토) 필터: 장소 수가 줄어든다
    await page.getByRole('button', { name: 'D3', exact: true }).click()
    await expect(page.getByText('1개 장소 표시')).toBeVisible()
  })
})
