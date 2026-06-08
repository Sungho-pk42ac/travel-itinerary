import { expect, test } from '@playwright/test'

test.describe('Overview', () => {
  test('우리 이야기·항공편·정책이 보인다', async ({ page }) => {
    await page.goto('/overview')
    await expect(page.getByRole('heading', { name: '우리 이야기' })).toBeVisible()
    await expect(page.getByText('MM712')).toBeVisible()
    await expect(page.getByText('7C1308')).toBeVisible()
    // 항공사 예약확인 링크
    await expect(page.getByRole('link', { name: /항공사 예약확인/ }).first()).toBeVisible()
  })
})

test.describe('POI 바텀시트', () => {
  test('Day1 USJ 항목 → 시트 열림(예약 링크) → Esc 닫힘', async ({ page }) => {
    await page.goto('/day/1')
    await page.getByRole('button', { name: /USJ 오후 입장/ }).click()

    const dialog = page.getByRole('dialog', { name: '유니버설 스튜디오 재팬' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'USJ 공식 예매' })).toBeVisible()
    await expect(dialog.getByRole('link', { name: '길찾기' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})
