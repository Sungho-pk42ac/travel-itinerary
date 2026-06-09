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

test.describe('POI 강아지 가이드', () => {
  test('Day1 USJ 탭 → 강아지 선택지 → 설명 → Esc 닫힘', async ({ page }) => {
    await page.goto('/day/1')
    await page.getByRole('button', { name: /USJ 오후 입장/ }).click()

    const dialog = page.getByRole('dialog', { name: '유니버설 스튜디오 재팬 가이드' })
    await expect(dialog).toBeVisible()
    // 선택지: 블로그/예약/설명
    await expect(dialog.getByText('블로그 후기')).toBeVisible()
    await expect(dialog.getByText('예약·정보')).toBeVisible()

    // 설명 → 안경 강아지 + 큐레이션 팩트 + 길찾기
    await dialog.getByRole('button', { name: /설명 들을래/ }).click()
    await expect(dialog.getByText(/슈퍼 닌텐도 월드/)).toBeVisible()
    await expect(dialog.getByRole('link', { name: '길찾기' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})
